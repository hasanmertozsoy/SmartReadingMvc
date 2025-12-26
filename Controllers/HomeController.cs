using Microsoft.AspNetCore.Mvc;

namespace SmartReadingMvc.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}