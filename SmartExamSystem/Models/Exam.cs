using System.ComponentModel.DataAnnotations;

namespace SmartExamSystem.Models
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int Duration { get; set; }

        public ICollection<Question> Questions { get; set; }
            = new List<Question>();

    }
}   