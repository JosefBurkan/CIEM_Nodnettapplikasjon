## Emkore

Emkore is a proof of concept developed by a group of students, and is therefore not perfect. 

Frameworks:
- [.NET 8]
- [Node.js and npm]

## Tec stack
- ASP.NET Core (C#) — Backend API
- React (with Vite) — Frontend UI
- Supabase - Database
- NSubstitute & NUnit — Testing

## package installation
Install inside .client folder:
npm install dagre @xyflow/react react-router-dom react-toastify react-qr-code @supabase/supabase-js 
npm install use-react-screenshot --legacy-peer-deps

install inside .server folder:
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL && dotnet add package Swashbuckle.AspNetCore

install inside .test folder:
dotnet add package NSubstitute --version 5.3.0 && dotnet add package NUnit --version 3.12.0 && dotnet add package NUnit3TestAdapter --version 4.0.0 && dotnet add package Microsoft.NET.Test.Sdk --version 17.3.2


