using Microsoft.AspNetCore.Mvc;
using Phenora.Api.Models;
using Phenora.Api.Services;

namespace Phenora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterpretationController : ControllerBase
    {
        private readonly AmrieInterpretationService _interpretationService;

        public InterpretationController(AmrieInterpretationService interpretationService)
        {
            _interpretationService = interpretationService;
        }

        [HttpPost]
        public ActionResult<InterpretationResult> Post([FromBody] AstMeasurement measurement)
        {
            if (measurement == null)
            {
                return BadRequest("Measurement cannot be null.");
            }

            var result = _interpretationService.Interpret(measurement);

            return Ok(result);
        }
    }
}
