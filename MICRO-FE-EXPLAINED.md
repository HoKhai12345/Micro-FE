# 📚 TÀI LIỆU CHI TIẾT: MICRO FRONTEND & MODULE FEDERATION

## 📋 Mục lục
1. [Micro Frontend là gì?](#micro-frontend-là-gì)
2. [Module Federation là gì?](#module-federation-là-gì)
3. [Cấu trúc dự án](#cấu-trúc-dự-án)
4. [Cách hoạt động chi tiết](#cách-hoạt-động-chi-tiết)
5. [Các file quan trọng](#các-file-quan-trọng)
6. [Luồng dữ liệu và tương tác](#luồng-dữ-liệu-và-tương-tác)
7. [Best Practices](#best-practices)

---

## 🎯 Micro Frontend là gì?

### Định nghĩa
**Micro Frontend** là một kiến trúc phần mềm cho phép bạn chia một ứng dụng frontend lớn thành nhiều ứng dụng nhỏ, độc lập. Mỗi ứng dụng nhỏ (micro app) có thể được:
- **Phát triển độc lập** bởi các team khác nhau
- **Deploy độc lập** mà không ảnh hưởng đến các app khác
- **Chạy độc lập** hoặc được tích hợp vào một ứng dụng lớn hơn
- **Sử dụng công nghệ khác nhau** (nếu cần) - Angular, React, Vue...

### So sánh với Monolithic Frontend

#### ❌ Monolithic Frontend (Cách truyền thống)
```
┌─────────────────────────────────────┐
│      MỘT ỨNG DỤNG LỚN               │
│                                     │
│  - Tất cả code trong 1 repo        │
│  - Tất cả team làm cùng 1 codebase │
│  - Deploy = deploy toàn bộ         │
│  - 1 lỗi = ảnh hưởng toàn bộ        │
└─────────────────────────────────────┘
```

**Vấn đề:**
- Team A thay đổi code → có thể ảnh hưởng Team B
- Deploy một tính năng nhỏ → phải deploy cả app
- Khó scale khi team lớn
- Conflict code thường xuyên

#### ✅ Micro Frontend (Cách hiện đại)
```
┌─────────────────────────────────────┐
│         SHELL (Host App)             │
│      Quản lý routing, layout         │
└──────────┬───────────────────────────┘
           │
    ┌──────┴──────┬──────────┬──────────┐
    │             │          │          │
┌───▼───┐  ┌─────▼───┐  ┌───▼───┐  ┌───▼───┐
│Dashboard│ │ Products│ │ Orders │ │ Users │
│  App    │ │   App   │ │  App   │ │  App  │
│         │ │         │ │        │ │       │
│Team A   │ │Team B   │ │Team C  │ │Team D │
└─────────┘ └─────────┘ └────────┘ └───────┘
```

**Lợi ích:**
- ✅ Mỗi team độc lập, không ảnh hưởng nhau
- ✅ Deploy từng app riêng biệt
- ✅ Dễ scale và bảo trì
- ✅ Có thể dùng công nghệ khác nhau

---

## 🔧 Module Federation là gì?

### Định nghĩa
**Module Federation** là một công nghệ (từ Webpack 5) cho phép một ứng dụng JavaScript **load code từ ứng dụng khác** một cách động tại runtime.

### Cách hoạt động cơ bản

#### 1. **Expose (Remote App)**
Ứng dụng con (Remote) **expose** component/module ra ngoài:
```javascript
// dashboard/federation.config.js
exposes: {
  './Component': './projects/dashboard/src/app/app.ts'
}
```
→ Dashboard app "cho phép" Shell app load component `App` của nó

#### 2. **Consume (Host App)**
Ứng dụng chủ (Host) **load** component từ Remote app:
```typescript
// shell/src/app/app.routes.ts
{
  path: 'dashboard',
  loadComponent: () =>
    loadRemoteModule('dashboard', './Component').then(m => m.App)
}
```
→ Shell app "yêu cầu" load component từ Dashboard app

#### 3. **Shared Dependencies**
Cả hai app **share** các thư viện chung để tránh duplicate:
```javascript
shared: {
  ...shareAll({ singleton: true, strictVersion: true })
}
```
→ Angular, RxJS, và các lib khác chỉ load 1 lần, cả hai app dùng chung

### Luồng hoạt động Module Federation

```
┌─────────────────────────────────────────────────────────┐
│ 1. User vào http://localhost:4200/dashboard             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Shell Router phát hiện route '/dashboard'            │
│    → Gọi loadRemoteModule('dashboard', './Component')   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Shell đọc federation.manifest.json                  │
│    Tìm thấy: "dashboard": "http://localhost:4201/..."  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Shell download remoteEntry.json từ Dashboard        │
│    File này chứa metadata về component được expose      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Shell download code JavaScript của Dashboard         │
│    Component (chunk files)                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Shell execute code và render Dashboard component    │
│    → User thấy Dashboard nhưng URL vẫn là 4200!        │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc dự án

### Tổng quan
```
Micro-FE/
├── package.json                    # Dependencies chung cho cả project
├── angular.json                    # Cấu hình Angular cho cả 2 apps
├── tsconfig.json                   # TypeScript config chung
│
├── projects/
│   ├── shell/                      # 🏠 SHELL APP (Host App)
│   │   ├── federation.config.js    # ⚙️ Cấu hình Module Federation
│   │   ├── public/
│   │   │   └── federation.manifest.json  # 📋 Danh sách remote apps
│   │   └── src/
│   │       ├── bootstrap.ts        # 🚀 Entry point
│   │       ├── main.ts             # Main file
│   │       └── app/
│   │           ├── app.ts          # Component chính
│   │           ├── app.config.service.ts  # App configuration (providers)
│   │           ├── app.routes.ts  # 🗺️ Routing (load remote modules)
│   │           └── app.html       # Template
│   │
│   └── dashboard/                  # 📊 DASHBOARD APP (Remote App)
│       ├── federation.config.js    # ⚙️ Cấu hình expose component
│       ├── public/
│       │   └── federation.manifest.json
│       └── src/
│           ├── bootstrap.ts        # 🚀 Entry point
│           ├── main.ts             # Main file
│           └── app/
│               ├── app.ts          # Component được expose
│               ├── app.config.service.ts   # App configuration
│               ├── app.routes.ts   # Routing nội bộ
│               └── app.html        # Template
│
└── start-all.ps1                   # Script chạy cả 2 apps (Windows)
```

### Chi tiết từng phần

#### 1. **Shell App** (Port 4200)
**Vai trò:** Ứng dụng chủ, điểm vào chính

**Chức năng:**
- Quản lý routing tổng thể
- Load các remote apps khi cần
- Cung cấp layout chung (header, footer, navigation)
- Quản lý shared providers (Monaco Editor, services chung...)

**File quan trọng:**
- `federation.config.js`: Không có `exposes`, chỉ có `shared` dependencies
- `federation.manifest.json`: Danh sách các remote apps và URL của chúng
- `app.routes.ts`: Định nghĩa routes và cách load remote modules

#### 2. **Dashboard App** (Port 4201)
**Vai trò:** Ứng dụng con, cung cấp component cho Shell

**Chức năng:**
- Expose component `App` ra ngoài
- Có thể chạy độc lập (standalone)
- Quản lý logic và UI riêng của Dashboard

**File quan trọng:**
- `federation.config.js`: Có `exposes` để expose component
- `app.ts`: Component được expose, Shell sẽ load component này

---

## 🔄 Cách hoạt động chi tiết

### Bước 1: Khởi động ứng dụng

#### Shell App (Port 4200)
```typescript
// shell/src/bootstrap.ts
bootstrapApplication(App, appConfig)
```
1. Angular khởi tạo Shell app
2. Load `app.config.service.ts` → Setup providers (Router, Monaco Editor...)
3. Load `app.routes.ts` → Đăng ký routes
4. Render `app.ts` component

#### Dashboard App (Port 4201)
```typescript
// dashboard/src/bootstrap.ts
bootstrapApplication(App, appConfig)
```
1. Angular khởi tạo Dashboard app
2. Load `app.config.service.ts` → Setup providers
3. Expose component qua `federation.config.js`
4. Tạo `remoteEntry.json` → File manifest cho Module Federation

### Bước 2: User truy cập Shell

```
User → http://localhost:4200
     ↓
Shell app render
     ↓
Hiển thị navigation menu
```

### Bước 3: User click vào "Dashboard" hoặc vào `/dashboard`

```
User → http://localhost:4200/dashboard
     ↓
Shell Router phát hiện route '/dashboard'
     ↓
Gọi loadRemoteModule('dashboard', './Component')
     ↓
Shell đọc federation.manifest.json
     ↓
Tìm thấy: "dashboard": "http://localhost:4201/remoteEntry.json"
     ↓
Shell fetch remoteEntry.json từ Dashboard
     ↓
Shell download code JavaScript của Dashboard component
     ↓
Shell execute code và render Dashboard component
     ↓
User thấy Dashboard component trong Shell app!
```

### Bước 4: Shared Dependencies

Khi Dashboard component được load:
- Angular, RxJS, và các lib shared được load từ Shell (đã có sẵn)
- Dashboard component sử dụng các lib này từ Shell
- Không duplicate code → Bundle size nhỏ hơn

---

## 📄 Các file quan trọng

### 1. Shell - `federation.manifest.json`
```json
{
  "dashboard": "http://localhost:4201/remoteEntry.json"
}
```
**Ý nghĩa:** 
- Shell biết Dashboard app ở đâu
- Khi cần load Dashboard, Shell sẽ fetch từ URL này
- Có thể thêm nhiều remote apps khác

**Ví dụ với nhiều apps:**
```json
{
  "dashboard": "http://localhost:4201/remoteEntry.json",
  "products": "http://localhost:4202/remoteEntry.json",
  "orders": "http://localhost:4203/remoteEntry.json"
}
```

### 2. Dashboard - `federation.config.js`
```javascript
module.exports = withNativeFederation({
  name: 'dashboard',
  exposes: {
    './Component': './projects/dashboard/src/app/app.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

**Giải thích:**
- `name: 'dashboard'`: Tên của remote app (dùng trong manifest)
- `exposes`: Các component/module được expose
  - `'./Component'`: Tên public (Shell dùng tên này để load)
  - `'./projects/dashboard/src/app/app.ts'`: Đường dẫn thực tế đến component
- `shared`: Các thư viện được share với Shell
  - `singleton: true`: Chỉ load 1 instance, cả hai app dùng chung
  - `strictVersion: true`: Phải cùng version
  - `requiredVersion: 'auto'`: Tự động detect version

**Expose nhiều components:**
```javascript
exposes: {
  './Component': './projects/dashboard/src/app/app.ts',
  './DashboardHeader': './projects/dashboard/src/app/header.ts',
  './DashboardFooter': './projects/dashboard/src/app/footer.ts'
}
```

### 3. Shell - `federation.config.js`
```javascript
module.exports = withNativeFederation({
  name: 'shell',
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

**Giải thích:**
- `name: 'shell'`: Tên của host app
- **KHÔNG có `exposes`**: Shell không expose gì, chỉ consume
- `shared`: Share dependencies với các remote apps

### 4. Shell - `app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app').then(m => m.App)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      loadRemoteModule('dashboard', './Component').then(m => m.App)
  }
];
```

**Giải thích:**
- Route `''`: Load component local từ Shell
- Route `'dashboard'`: Load component từ Dashboard app
  - `loadRemoteModule('dashboard', './Component')`:
    - `'dashboard'`: Tên remote app (trong manifest)
    - `'./Component'`: Tên component được expose
  - `.then(m => m.App)`: Lấy class `App` từ module

### 5. Shell - `app.config.service.ts`
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMonacoEditor({
      baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs'
    })
  ]
};
```

**Giải thích:**
- `provideRouter(routes)`: Setup routing
- `provideMonacoEditor(...)`: Setup Monaco Editor provider
  - **Quan trọng:** Shell phải provide Monaco Editor vì Dashboard component (load từ remote) cần dùng nó
  - Khi remote component được load, nó sử dụng providers từ Shell

### 6. Dashboard - `app.ts`
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent, FormsModule],
  templateUrl: './app.html'
})
export class App {
  title = signal('Dashboard - Remote Module');
  code = `function hello() { ... }`;
  options = { theme: 'vs-dark', language: 'typescript' };
}
```

**Giải thích:**
- `standalone: true`: Component độc lập, không cần NgModule
- `imports`: Import các component/directive cần dùng
- Component này được expose và Shell sẽ load nó

---

## 🔀 Luồng dữ liệu và tương tác

### 1. Communication giữa Shell và Dashboard

#### Option 1: Input/Output (Parent-Child)
```typescript
// Shell component
<router-outlet></router-outlet>  // Dashboard component render ở đây

// Dashboard component
@Input() data: any;
@Output() event = new EventEmitter();
```

#### Option 2: Services (Shared)
```typescript
// Tạo service trong Shell, share với Dashboard
@Injectable({ providedIn: 'root' })
export class SharedService {
  data$ = new BehaviorSubject<any>(null);
}
```

#### Option 3: State Management (NgRx, Akita...)
```typescript
// Dùng state management library được share
// Cả Shell và Dashboard đều có thể access store
```

### 2. Routing

#### Shell quản lý routing tổng:
```typescript
/dashboard          → Load Dashboard component
/dashboard/settings → Load Dashboard component (Dashboard tự quản lý sub-routes)
/products           → Load Products component (nếu có)
```

#### Dashboard có thể có routing nội bộ:
```typescript
// dashboard/src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: DashboardHome },
  { path: 'settings', component: DashboardSettings }
];
```

### 3. Shared Dependencies

Khi Shell và Dashboard share dependencies:
- **Angular Core**: Chỉ load 1 lần từ Shell
- **RxJS**: Chỉ load 1 lần từ Shell
- **Monaco Editor**: Provider từ Shell, Dashboard component dùng chung

**Lợi ích:**
- Bundle size nhỏ hơn
- Performance tốt hơn
- Đảm bảo cùng version

---

## ✅ Best Practices

### 1. **Provider Management**
```typescript
// ✅ ĐÚNG: Shell provide tất cả providers cần thiết
// Shell app.config.service.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMonacoEditor({ ... }),  // Dashboard cần dùng
    provideHttpClient(),            // Nếu Dashboard cần HTTP
  ]
};

// ❌ SAI: Chỉ provide trong Dashboard
// Dashboard component sẽ không tìm thấy provider khi load từ Shell
```

### 2. **Version Management**
```javascript
// ✅ ĐÚNG: Dùng strictVersion để đảm bảo cùng version
shared: {
  ...shareAll({ 
    singleton: true, 
    strictVersion: true,  // Bắt buộc cùng version
    requiredVersion: 'auto' 
  })
}

// ⚠️ CẨN THẬN: Nếu version khác nhau → có thể lỗi
```

### 3. **Error Handling**
```typescript
// ✅ ĐÚNG: Handle lỗi khi load remote module
{
  path: 'dashboard',
  loadComponent: () =>
    loadRemoteModule('dashboard', './Component')
      .then(m => m.App)
      .catch(err => {
        console.error('Failed to load dashboard', err);
        return ErrorComponent;  // Fallback component
      })
}
```

### 4. **Lazy Loading**
```typescript
// ✅ ĐÚNG: Chỉ load remote module khi cần
{
  path: 'dashboard',
  loadComponent: () => loadRemoteModule(...)  // Lazy load
}

// ❌ SAI: Import trực tiếp
import { App } from 'dashboard/Component';  // Load ngay lập tức
```

### 5. **Development vs Production**
```javascript
// Development
"dashboard": "http://localhost:4201/remoteEntry.json"

// Production
"dashboard": "https://dashboard.mycompany.com/remoteEntry.json"
```

### 6. **Testing**
- Test Shell app độc lập
- Test Dashboard app độc lập
- Test integration (Shell load Dashboard)

---

## 🎓 Tóm tắt

### Micro Frontend
- ✅ Chia ứng dụng lớn thành nhiều app nhỏ
- ✅ Mỗi app độc lập, có thể deploy riêng
- ✅ Mỗi team phát triển app riêng

### Module Federation
- ✅ Công nghệ cho phép load code từ app khác
- ✅ Share dependencies để tránh duplicate
- ✅ Load động tại runtime

### Trong dự án này
- **Shell** (4200): Host app, load Dashboard
- **Dashboard** (4201): Remote app, expose component
- **Module Federation**: Cơ chế kết nối hai app

### Lợi ích
- ✅ Scalability: Dễ thêm app mới
- ✅ Independence: Mỗi team độc lập
- ✅ Performance: Share dependencies, bundle nhỏ
- ✅ Flexibility: Có thể dùng công nghệ khác nhau

---

## 📚 Tài liệu tham khảo

- [Angular Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Module Federation Concept](https://webpack.js.org/concepts/module-federation/)
- [Micro Frontends Guide](https://micro-frontends.org/)

---

**Chúc bạn thành công với Micro Frontend! 🚀**
