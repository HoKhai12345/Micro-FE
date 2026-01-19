# 🔄 SHARE SERVICE qua MODULE FEDERATION

## ✅ Cách đúng với Module Federation:

### Kiến trúc:
```
Shell (Host)                    Dashboard (Remote)
├── ConfigService               ├── Component
│   └── Expose qua MF           │   └── Load từ Shell
└── Provide trong app.config    └── Inject từ Shell
```

## 🎯 CÁCH 1: Shell Expose, Dashboard Load (Khuyên dùng)

### Bước 1: Shell expose ConfigService

```javascript
// shell/federation.config.js
module.exports = {
  name: 'shell',
  exposes: {
    './ConfigService': './projects/shell/src/app/shared/config.service.ts'
  }
};
```

### Bước 2: Dashboard load ConfigService từ Shell

```typescript
// dashboard/src/app/app.ts
import { Component, inject, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({...})
export class App implements OnInit {
  configService: any;

  async ngOnInit() {
    // Load ConfigService từ Shell
    const module = await loadRemoteModule('shell', './ConfigService');
    this.configService = new module.ConfigService();
  }
}
```

**Nhược điểm:** Phải load động, phức tạp hơn

---

## 🎯 CÁCH 2: Shell Provide, Dashboard Inject (Đơn giản hơn)

### Bước 1: Shell provide ConfigService

```typescript
// shell/src/app/app.config.ts
import { ConfigService } from './shared/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    ConfigService,  // Provide ConfigService
    // ... other providers
  ]
};
```

### Bước 2: Dashboard inject ConfigService

```typescript
// dashboard/src/app/app.ts
import { Component, inject } from '@angular/core';

@Component({...})
export class App {
  // Khi Dashboard load vào Shell, Angular DI sẽ tìm ConfigService từ Shell
  configService = inject(ConfigService);
}
```

**Vấn đề:** Dashboard cần có ConfigService riêng để chạy độc lập

---

## 🎯 CÁCH 3: Hybrid - Có cả 2 (Cách hiện tại)

### Shell có ConfigService và expose
### Dashboard có ConfigService riêng để chạy độc lập
### Khi Dashboard load vào Shell → có thể sync hoặc dùng từ Shell

**Ưu điểm:**
- ✅ Dashboard có thể chạy độc lập
- ✅ Có thể share khi cần

**Nhược điểm:**
- ⚠️ Có thể có 2 instance khác nhau

---

## 💡 KẾT LUẬN:

**Với Module Federation:**
- ✅ Có thể expose service từ một app
- ✅ Các app khác load service đó một cách động
- ⚠️ Phức tạp hơn shared folder (monorepo)

**Khuyến nghị:**
- **Monorepo:** Dùng shared folder (cách hiện tại) ✅
- **Multi-repo:** Dùng NPM Package hoặc Module Federation expose

**Lưu ý:**
- Module Federation expose service phù hợp cho **runtime sharing**
- NPM Package phù hợp cho **build-time sharing**
