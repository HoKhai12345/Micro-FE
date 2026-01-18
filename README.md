# Micro Frontend với Angular Native Federation

> 📚 **Tài liệu chi tiết:** Xem file [MICRO-FE-EXPLAINED.md](./MICRO-FE-EXPLAINED.md) để hiểu sâu về:
> - Micro Frontend là gì và tại sao cần dùng
> - Module Federation hoạt động như thế nào
> - Cấu trúc dự án chi tiết
> - Best practices và troubleshooting

## 🔍 Giải thích cách hoạt động

### Micro Frontend là gì?
Micro Frontend là kiến trúc cho phép bạn chia ứng dụng lớn thành nhiều ứng dụng nhỏ độc lập, mỗi ứng dụng có thể được phát triển, deploy và chạy riêng biệt.

### Kiến trúc trong dự án này:

```
┌─────────────────────────────────────┐
│         SHELL (Host App)            │
│      Port: 4200                     │
│                                     │
│  - Là ứng dụng chính               │
│  - Load các remote apps             │
│  - Quản lý routing tổng             │
└──────────────┬──────────────────────┘
               │
               │ Load Remote Module
               │
               ▼
┌─────────────────────────────────────┐
│      DASHBOARD (Remote App)         │
│      Port: 4201                     │
│                                     │
│  - Là ứng dụng con                 │
│  - Expose component ra ngoài        │
│  - Chạy độc lập                    │
└─────────────────────────────────────┘
```

### Cách hoạt động:

1. **Shell** (Port 4200): 
   - Ứng dụng chủ, là điểm vào chính
   - Đọc `federation.manifest.json` để biết các remote apps ở đâu
   - Khi user vào route `/dashboard`, shell sẽ load component từ Dashboard app

2. **Dashboard** (Port 4201):
   - Ứng dụng remote, expose component ra ngoài
   - File `federation.config.js` định nghĩa expose `./Component` = component App
   - Chạy độc lập, có thể truy cập trực tiếp ở `http://localhost:4201`

3. **Module Federation**:
   - Cho phép shell load code JavaScript từ dashboard khi cần
   - Share các thư viện chung (Angular, RxJS...) để tránh duplicate

## 🚀 Cách chạy dự án

### Cách 1: Chạy thủ công (Khuyên dùng để hiểu rõ)

**Bước 1: Chạy Dashboard (Remote App)**
```bash
npm run start -- --project=dashboard
```
- Mở terminal đầu tiên
- Chạy lệnh trên
- Dashboard sẽ chạy ở: `http://localhost:4201`

**Bước 2: Chạy Shell (Host App)**
```bash
npm run start -- --project=shell
```
- Mở terminal thứ hai
- Chạy lệnh trên
- Shell sẽ chạy ở: `http://localhost:4200`

**Bước 3: Mở trình duyệt**
- Truy cập: `http://localhost:4200`
- Bạn sẽ thấy Shell app
- Click vào link "Xem Dashboard (Remote)" hoặc vào `http://localhost:4200/dashboard`
- Component Dashboard sẽ được load từ port 4201!

### Cách 2: Sử dụng script tự động

```bash
npm run start:all
```

## 📁 Cấu trúc dự án

```
Micro-FE/
├── projects/
│   ├── shell/                    # Ứng dụng chủ (Host)
│   │   ├── federation.config.js  # Cấu hình federation (không có exposes)
│   │   ├── public/
│   │   │   └── federation.manifest.json  # Danh sách remote apps
│   │   └── src/
│   │       ├── app/
│   │       │   ├── app.routes.ts  # Route định nghĩa load remote
│   │       │   └── app.ts         # Component chính của shell
│   │       └── main.ts           # Khởi tạo federation
│   │
│   └── dashboard/                 # Ứng dụng con (Remote)
│       ├── federation.config.js   # Cấu hình expose component
│       └── src/
│           ├── app/
│           │   ├── app.routes.ts  # Route nội bộ
│           │   └── app.ts         # Component được expose
│           └── main.ts           # Khởi tạo federation
```

## 🎯 Các file quan trọng

### 1. `shell/public/federation.manifest.json`
```json
{
  "dashboard": "http://localhost:4201/remoteEntry.json"
}
```
→ Shell biết Dashboard app ở đâu

### 2. `dashboard/federation.config.js`
```javascript
exposes: {
  './Component': './projects/dashboard/src/app/app.ts',
}
```
→ Dashboard expose component App với tên './Component'

### 3. `shell/src/app/app.routes.ts`
```typescript
{
  path: 'dashboard',
  loadComponent: () =>
    loadRemoteModule('dashboard', './Component').then(m => m.App)
}
```
→ Shell load component từ Dashboard khi vào route `/dashboard`

## 🔧 Debugging

1. **Kiểm tra cả hai app đang chạy**:
   - Shell: `http://localhost:4200`
   - Dashboard: `http://localhost:4201`

2. **Xem console trình duyệt**:
   - Mở DevTools (F12)
   - Tab Console sẽ hiển thị lỗi nếu có

3. **Kiểm tra Network tab**:
   - Khi vào `/dashboard`, bạn sẽ thấy request đến `http://localhost:4201/remoteEntry.json`
   - Đây là file manifest của Dashboard

## 📝 Lưu ý quan trọng

- **Phải chạy Dashboard TRƯỚC Shell** (hoặc cùng lúc), vì Shell cần load code từ Dashboard
- Nếu Dashboard không chạy, Shell sẽ không thể load component từ Dashboard
- Mỗi app có thể chạy độc lập và truy cập riêng

## 🎓 Hiểu rõ hơn

Khi bạn vào `http://localhost:4200/dashboard`:
1. Shell app đang chạy ở port 4200
2. Router phát hiện route `/dashboard`
3. Shell đọc `federation.manifest.json` để tìm Dashboard
4. Shell load file `remoteEntry.json` từ `http://localhost:4201`
5. Shell download và execute code JavaScript của Dashboard component
6. Component Dashboard được render trong Shell app
7. Bạn thấy nội dung Dashboard nhưng URL vẫn là `localhost:4200`!

→ Đây chính là "Module Federation" - load code từ app khác một cách động!
