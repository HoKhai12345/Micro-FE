# 🚀 HƯỚNG DẪN CHẠY MICRO FRONTEND

## Cách chạy nhanh nhất (Windows)

### Bước 1: Chạy script tự động
```powershell
.\start-all.ps1
```

Script này sẽ tự động mở 2 terminal và chạy cả hai app!

### Bước 2: Mở trình duyệt
1. Đợi cả hai app compile xong (sẽ thấy "Application bundle generation complete")
2. Mở trình duyệt vào: **http://localhost:4200**
3. Bạn sẽ thấy Shell app với navigation menu

### Bước 3: Test Micro Frontend
1. Click vào link **"Xem Dashboard (Remote)"** hoặc vào **http://localhost:4200/dashboard**
2. Dashboard component sẽ được load từ port 4201!
3. Xem Network tab (F12) sẽ thấy request đến `remoteEntry.json` từ port 4201

---

## Cách chạy thủ công (Để hiểu rõ hơn)

### Terminal 1: Chạy Dashboard
```bash
npm run start:dashboard
```
- Dashboard sẽ chạy ở: **http://localhost:4201**
- Đợi thấy message "Application bundle generation complete"

### Terminal 2: Chạy Shell
```bash
npm run start:shell
```
- Shell sẽ chạy ở: **http://localhost:4200**
- Đợi thấy message "Application bundle generation complete"

### Mở trình duyệt
- Vào: **http://localhost:4200**
- Click "Xem Dashboard (Remote)"

---

## 🔍 Cách hiểu Micro Frontend hoạt động

### Luồng hoạt động khi vào /dashboard:

```
Bước 1: User vào http://localhost:4200/dashboard
         ↓
Bước 2: Shell app (port 4200) xử lý route
         ↓
Bước 3: Router thấy route 'dashboard' → gọi loadRemoteModule
         ↓
Bước 4: Shell đọc federation.manifest.json
         Tìm thấy: "dashboard": "http://localhost:4201/remoteEntry.json"
         ↓
Bước 5: Shell download remoteEntry.json từ Dashboard
         ↓
Bước 6: Shell load code JavaScript của Dashboard component
         ↓
Bước 7: Dashboard component được render trong Shell app
         ↓
Bước 8: User thấy nội dung Dashboard nhưng URL vẫn là localhost:4200!
```

### So sánh:

**Khi vào http://localhost:4200:**
- ✅ Thấy Shell component
- ✅ Load từ Shell app (port 4200)

**Khi vào http://localhost:4200/dashboard:**
- ✅ Thấy Dashboard component  
- ✅ Nhưng component này được load từ Dashboard app (port 4201)!
- ✅ Tất cả chạy trong cùng một trang, cùng một Angular app (Shell)

**Khi vào http://localhost:4201:**
- ✅ Thấy Dashboard app chạy độc lập
- ✅ Có thể truy cập trực tiếp Dashboard

---

## 📂 Các file quan trọng cần hiểu

### 1. Shell - federation.manifest.json
```json
{
  "dashboard": "http://localhost:4201/remoteEntry.json"
}
```
**Ý nghĩa:** Shell biết Dashboard app ở đâu và cách load nó

### 2. Dashboard - federation.config.js
```javascript
exposes: {
  './Component': './projects/dashboard/src/app/app.ts',
}
```
**Ý nghĩa:** Dashboard expose component App với tên './Component' để Shell có thể load

### 3. Shell - app.routes.ts
```typescript
{
  path: 'dashboard',
  loadComponent: () =>
    loadRemoteModule('dashboard', './Component').then(m => m.App)
}
```
**Ý nghĩa:** Khi vào route '/dashboard', Shell sẽ load component từ Dashboard app

---

## ✅ Checklist để đảm bảo chạy đúng

- [ ] Dashboard app đang chạy ở port 4201
- [ ] Shell app đang chạy ở port 4200
- [ ] Cả hai app đã compile thành công (không có lỗi)
- [ ] Browser console không có lỗi
- [ ] Vào http://localhost:4200 thấy Shell app
- [ ] Vào http://localhost:4200/dashboard thấy Dashboard component
- [ ] Network tab thấy request đến remoteEntry.json từ port 4201

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch remoteEntry.json"
**Nguyên nhân:** Dashboard chưa chạy hoặc chạy sai port
**Giải pháp:** 
- Kiểm tra Dashboard đang chạy ở port 4201
- Kiểm tra `federation.manifest.json` có đúng URL không

### Lỗi: "Module not found"
**Nguyên nhân:** Component export sai tên
**Giải pháp:** 
- Kiểm tra `federation.config.js` expose đúng component
- Kiểm tra `app.routes.ts` load đúng tên component (m.App)

### Lỗi: "CORS error"
**Nguyên nhân:** Cross-origin issues
**Giải pháp:** 
- Đảm bảo cả hai app chạy trên localhost
- Kiểm tra ports đúng (4200 và 4201)

---

## 🎓 Tóm tắt

**Micro Frontend = Chia ứng dụng lớn thành nhiều app nhỏ độc lập**

1. **Shell** = App chủ, quản lý routing và load các remote apps
2. **Dashboard** = App con, expose component để Shell load
3. **Module Federation** = Cơ chế cho phép load code JavaScript từ app khác

**Lợi ích:**
- ✅ Mỗi team có thể phát triển app riêng
- ✅ Deploy độc lập
- ✅ Có thể dùng framework khác nhau (nếu cần)
- ✅ Dễ scale và bảo trì

---

Chúc bạn thành công! 🎉
