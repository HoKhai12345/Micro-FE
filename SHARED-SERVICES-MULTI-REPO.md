# 🔄 SHARED SERVICES trong MULTI-REPO

## ⚠️ Vấn đề bạn đã phát hiện:

> "Sao tạo folder chung xong gọi vào đó thì có gì hot, 1 repo, thế nhiều repo thì toang à?"

**Đúng rồi!** Cách hiện tại (`shared/` folder) chỉ hoạt động với **MONOREPO** (1 repo).

Với **MULTI-REPO** (nhiều repo riêng), mỗi repo độc lập → không thể import trực tiếp từ folder chung!

---

## 🎯 3 CÁCH SHARE SERVICES trong MULTI-REPO

### Cách 1: Publish Shared Library lên NPM (Khuyên dùng) ⭐

**Cách hoạt động:**
- Tạo 1 repo riêng cho shared services
- Build và publish lên npm (hoặc private npm registry)
- Các apps khác install như package bình thường

**Ví dụ:**

```bash
# 1. Tạo repo shared-services
shared-services/
├── package.json
├── src/
│   └── config.service.ts
└── dist/

# 2. Build và publish
npm run build
npm publish  # hoặc npm publish --registry=https://your-private-npm.com

# 3. Các apps install
cd shell-app
npm install @company/shared-services

cd dashboard-app  
npm install @company/shared-services
```

**Code:**

```typescript
// shell-app/src/app/app.ts
import { ConfigService } from '@company/shared-services';

// dashboard-app/src/app/app.ts
import { ConfigService } from '@company/shared-services';
```

**Ưu điểm:**
- ✅ Hoàn toàn độc lập
- ✅ Version control rõ ràng (`@company/shared-services@1.0.0`)
- ✅ Dễ maintain và update
- ✅ Có thể có CI/CD riêng cho shared library

**Nhược điểm:**
- ❌ Cần setup npm registry (nếu private)
- ❌ Phải publish mỗi khi thay đổi

---

### Cách 2: Expose Service qua Module Federation (Từ 1 App)

**Cách hoạt động:**
- Một app (ví dụ Shell) có ConfigService
- Expose ConfigService qua Module Federation
- Các apps khác load service từ Shell app

**Ví dụ:**

```javascript
// shell-app/federation.config.js
module.exports = {
  name: 'shell',
  exposes: {
    './ConfigService': './src/app/shared/config.service.ts'
  }
};
```

```typescript
// dashboard-app/src/app/app.ts
import { loadRemoteModule } from '@angular-architects/native-federation';

// Load service động
const ConfigServiceModule = await loadRemoteModule('shell', './ConfigService');
const ConfigService = ConfigServiceModule.ConfigService;
```

**Ưu điểm:**
- ✅ Không cần npm registry
- ✅ Service được share tại runtime
- ✅ Shell là source of truth

**Nhược điểm:**
- ❌ Phụ thuộc vào Shell app
- ❌ Nếu Shell down → các app khác không load được service
- ❌ Phức tạp hơn (phải load động)

---

### Cách 3: Git Submodule hoặc Monorepo Tool (Nx, Turborepo)

**Cách hoạt động:**
- Dùng công cụ quản lý monorepo như Nx, Turborepo
- Hoặc Git submodule để link shared code

**Ví dụ với Nx:**

```bash
# Tạo shared library trong Nx workspace
nx generate @nx/angular:library shared-services

# Apps tự động có thể import
import { ConfigService } from '@workspace/shared-services';
```

**Ưu điểm:**
- ✅ Vẫn có thể tách repo riêng
- ✅ Tool quản lý dependencies tự động
- ✅ Build optimization

**Nhược điểm:**
- ❌ Cần học thêm tool mới
- ❌ Setup phức tạp hơn

---

## 📊 So sánh 3 cách:

| Tiêu chí | NPM Package | Module Federation | Monorepo Tool |
|----------|-------------|-------------------|---------------|
| **Độc lập** | ✅✅✅ | ⚠️ Phụ thuộc Shell | ✅✅ |
| **Dễ setup** | ✅✅ | ✅✅✅ | ⚠️ Phức tạp |
| **Version control** | ✅✅✅ | ❌ | ✅✅ |
| **Runtime sharing** | ❌ | ✅✅✅ | ❌ |
| **Phù hợp** | Production | Development/Testing | Enterprise |

---

## 🎯 KHUYẾN NGHỊ:

### Cho Production (Multi-repo):
**→ Dùng Cách 1: NPM Package**

```bash
# Tạo shared-services repo
shared-services/
├── package.json
│   {
│     "name": "@company/shared-services",
│     "version": "1.0.0"
│   }
├── src/
│   └── config.service.ts
└── dist/

# Publish
npm publish

# Apps install
npm install @company/shared-services@^1.0.0
```

### Cho Development (Monorepo hiện tại):
**→ Giữ nguyên cách hiện tại (`shared/` folder)**

```typescript
// Cả Shell và Dashboard import từ shared/
import { ConfigService } from '@shared/services/config.service';
```

---

## 🔄 Migration Path: Monorepo → Multi-repo

### Bước 1: Tách shared services ra repo riêng

```bash
# Tạo repo mới
mkdir shared-services
cd shared-services
npm init -y

# Copy code từ shared/ vào đây
cp -r ../Micro-FE/shared/* ./src/

# Setup build
npm install --save-dev typescript @angular/core
# ... setup build config

# Publish
npm publish
```

### Bước 2: Cập nhật các apps

```bash
# Shell app
cd shell-app
npm install @company/shared-services
# Xóa import từ @shared, dùng từ package

# Dashboard app
cd dashboard-app
npm install @company/shared-services
# Xóa import từ @shared, dùng từ package
```

### Bước 3: Xóa shared folder trong monorepo

```bash
# Nếu không còn cần monorepo
rm -rf shared/
```

---

## 💡 KẾT LUẬN:

**Hiện tại (Monorepo):**
- ✅ Cách hiện tại (`shared/` folder) là **ĐÚNG** cho monorepo
- ✅ Dễ dàng, nhanh chóng
- ✅ Phù hợp cho development và team nhỏ

**Khi chuyển sang Multi-repo:**
- ✅ Nên dùng **NPM Package** cho shared services
- ✅ Mỗi service update → publish version mới
- ✅ Apps update version khi cần

**Lưu ý quan trọng:**
- Micro Frontend **KHÔNG phụ thuộc** vào cách share code
- Dù monorepo hay multi-repo, **runtime vẫn giống nhau** (load qua HTTP)
- Chọn cách phù hợp với team và workflow của bạn!

---

## 📚 Tài liệu tham khảo:

- [NPM Private Packages](https://docs.npmjs.com/creating-and-publishing-private-packages)
- [Module Federation Expose Services](https://webpack.js.org/concepts/module-federation/)
- [Nx Workspace](https://nx.dev/)
- [Turborepo](https://turborepo.org/)
