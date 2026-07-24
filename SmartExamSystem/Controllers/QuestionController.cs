using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartExamSystem.Data;
using SmartExamSystem.Models;
using OfficeOpenXml;
using Microsoft.AspNetCore.Http;

namespace SmartExamSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add Question
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddQuestion(Question question)
        {
            _context.Questions.Add(question);
            _context.SaveChanges();

            return Ok("Question Added Successfully");
        }

        // Get All Questions
        [HttpGet]
        public IActionResult GetQuestions()
        {
            var questions = _context.Questions.ToList();

            return Ok(questions);
        }

        // Get Question By Id
        [HttpGet("{id}")]
        public IActionResult GetQuestion(int id)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            return Ok(question);
        }

        // Get Questions By Exam Id
        [HttpGet("exam/{examId}")]
        public IActionResult GetQuestionsByExam(int examId)
        {
            var questions = _context.Questions
                .Where(q => q.ExamId == examId)
                .ToList();

            questions = questions
                .OrderBy(q => Guid.NewGuid())
                .ToList();

            return Ok(questions);
        }

        // Update Question
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateQuestion(int id, Question updatedQuestion)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            question.QuestionText = updatedQuestion.QuestionText;
            question.OptionA = updatedQuestion.OptionA;
            question.OptionB = updatedQuestion.OptionB;
            question.OptionC = updatedQuestion.OptionC;
            question.OptionD = updatedQuestion.OptionD;
            question.CorrectAnswer = updatedQuestion.CorrectAnswer;
            question.ExamId = updatedQuestion.ExamId;

            _context.SaveChanges();

            return Ok("Question Updated Successfully");
        }

        // Delete Question
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteQuestion(int id)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            _context.Questions.Remove(question);
            _context.SaveChanges();

            return Ok("Question Deleted Successfully");
        }

        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public IActionResult ImportExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload an Excel file.");

            using var stream = new MemoryStream();

            file.CopyTo(stream);

            using var package = new ExcelPackage(stream);

            var worksheet = package.Workbook.Worksheets[0];

            int rowCount = worksheet.Dimension.Rows;

            for (int row = 2; row <= rowCount; row++)
            {
                string examTitle = worksheet.Cells[row, 1].Text;
                string questionText = worksheet.Cells[row, 2].Text;
                string optionA = worksheet.Cells[row, 3].Text;
                string optionB = worksheet.Cells[row, 4].Text;
                string optionC = worksheet.Cells[row, 5].Text;
                string optionD = worksheet.Cells[row, 6].Text;
                string correctAnswer = worksheet.Cells[row, 7].Text;

                // Find existing exam
                var exam = _context.Exams
                    .FirstOrDefault(e => e.Title == examTitle);

                // Create exam if it doesn't exist
                if (exam == null)
                {
                    exam = new Exam
                    {
                        Title = examTitle,
                        Description = examTitle + " Exam",
                        Duration = 30
                    };

                    _context.Exams.Add(exam);
                    _context.SaveChanges();
                }

                var question = new Question
                {
                    QuestionText = questionText,
                    OptionA = optionA,
                    OptionB = optionB,
                    OptionC = optionC,
                    OptionD = optionD,
                    CorrectAnswer = correctAnswer,
                    ExamId = exam.Id
                };

                _context.Questions.Add(question);
            }

            _context.SaveChanges();

            return Ok("Questions Imported Successfully");
        }
    }
}