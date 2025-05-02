## Emkore

Emkore is a proof of concept developed by a group of students, and is therefore not perfect. 

Frameworks:
- [.NET 8]
- [Node.js and npm]

## Technology
- ASP.NET Core (C#) — Backend API
- React (with Vite) — Frontend UI
- Supabase - Database
- NSubstitute & NUnit — Testing

## package installation
**Install inside .client folder:**
npm install dagre @xyflow/react react-router-dom react-toastify react-qr-code @supabase/supabase-js 
npm install use-react-screenshot --legacy-peer-deps

**install inside .server folder:**
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL && dotnet add package Swashbuckle.AspNetCore && package DotNetEnv

**install inside .test folder:**
dotnet add package NSubstitute --version 5.3.0 && dotnet add package NUnit --version 3.12.0 && dotnet add package NUnit3TestAdapter --version 4.0.0 && dotnet add package Microsoft.NET.Test.Sdk --version 17.3.2

## .ENV File
Create a .env file inside the root of the .Server folder. Add the following variable to it:
DefaultConnection="YourDatabaseConnectionStringHere"
This will be the the connection used for the database

## Code structure
Most of the code is finished, but in some places like LiveNetwork.jsx, it still needs to be split into components.
Some other files have poorly structured code as well.

