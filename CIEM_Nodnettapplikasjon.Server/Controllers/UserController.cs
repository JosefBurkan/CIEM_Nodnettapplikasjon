using Microsoft.AspNetCore.Mvc;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
