using Microsoft.AspNetCore.Mvc;
using FilaZero.Domain.Interfaces;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller principal da aplicação
    /// </summary>
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public HomeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Página inicial da aplicação
        /// </summary>
        /// <returns>View da página inicial</returns>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Página de erro
        /// </summary>
        /// <returns>View de erro</returns>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View();
        }

        /// <summary>
        /// Página do KDS (Kitchen Display System)
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>View do KDS</returns>
        public IActionResult KDS(Guid? eventoId)
        {
            ViewBag.EventoId = eventoId;
            return View();
        }

        /// <summary>
        /// Página de gestão de produtos
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>View de gestão de produtos</returns>
        public IActionResult Produtos(Guid? eventoId)
        {
            ViewBag.EventoId = eventoId;
            return View();
        }

        /// <summary>
        /// Página de pedidos
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>View de pedidos</returns>
        public IActionResult Pedidos(Guid? eventoId)
        {
            ViewBag.EventoId = eventoId;
            return View();
        }

        /// <summary>
        /// Página de login
        /// </summary>
        /// <returns>View de login</returns>
        public IActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// Página de registro
        /// </summary>
        /// <returns>View de registro</returns>
        public IActionResult Register()
        {
            return View();
        }
    }
}
