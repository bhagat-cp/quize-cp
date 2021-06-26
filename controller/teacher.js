const questions = require("./../modal/questions");
const studentsAnsweres = require("./../modal/studentsAnswers");
const quizRooms = require("./../modal/quizRooms");

exports.getQuestion = (req, res, next) => {
  let query = req.query.qindex;
  query = Number(query);
  console.log(query);
  let totalQuestions = questions.length;

  if (query >= totalQuestions) {
    return res.status(301).json({
      status: "failed",
      message: "No new question",
    });
  }

  let selectedQuestion = questions[query];
  console.log(selectedQuestion);
  return res.status(200).json({
    status: "success",
    data: {
      ...selectedQuestion,
      qIndex: query,
    },
  });
};

exports.questionAnswered = (req, res, next) => {
  let data = req.body;
  const {
    studentName,
    studentId,
    qIndex,
    questionId,
    status,
    answer,
    timeTaken,
    roomCode,
    teacherId,
    date,
  } = data;

  let correct = false;

  if (questions[qIndex].answer == answer) {
    correct = true;
  }

  let studentIndex = studentsAnsweres.findIndex(
    (stud) => stud.studentId === studentId
  );

  if (studentIndex === -1) {
    studentIndex = studentsAnsweres.length;
    studentsAnsweres.push({
      studentName,
      studentId,
    });
  }

  if (!studentsAnsweres[studentIndex].rooms) {
    studentsAnsweres[studentIndex].rooms = {}
  }

  if (!studentsAnsweres[studentIndex].rooms[roomCode]) {
    studentsAnsweres[studentIndex].rooms[roomCode] = {};
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"];
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"] = {};
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"]["correct"] = [];
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"]["wrong"] = [];
    studentsAnsweres[studentIndex].rooms[roomCode]["qskipped"] = []
    studentsAnsweres[studentIndex].rooms[roomCode].score = 0;
    studentsAnsweres[studentIndex].rooms[roomCode].totalTime = 0;
    
  }

  if (correct) {
    studentsAnsweres[studentIndex].rooms[roomCode].qAnswered.correct.push({
      qIndex,
      questionId,
      answer,
      timeTaken,
      teacherId,
      date,
    });
    studentsAnsweres[studentIndex].rooms[roomCode].score += 1;
    studentsAnsweres[studentIndex].rooms[roomCode].totalTime += timeTaken;

  } else {
    studentsAnsweres[studentIndex].rooms[roomCode].qAnswered.wrong.push({
      qIndex,
      questionId,
      teacherId,
      date,
    });
  }

  return res.status(201).json({ status: "answer submitted", data: studentsAnsweres  });
};

exports.questionSkipped = (req, res, next) => {
  let data = req.body;
  const {
    studentName,
    studentId,
    qIndex,
    questionId,
    status,
    roomCode,
    teacherId,
    date,
  } = data;

  let studentIndex = studentsAnsweres.findIndex(
    (stud) => stud.studentId === studentId
  );

  if (studentIndex === -1) {
    studentIndex = studentsAnsweres.length;
    studentsAnsweres.push({
      studentName,
      studentId,
    });
  }

  if (!studentsAnsweres[studentIndex].rooms) {
    studentsAnsweres[studentIndex].rooms = {}
  }

  if (!studentsAnsweres[studentIndex].rooms[roomCode]) {
    studentsAnsweres[studentIndex].rooms[roomCode] = {};
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"];
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"] = {};
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"]["correct"] = [];
    studentsAnsweres[studentIndex].rooms[roomCode]["qAnswered"]["wrong"] = [];
    studentsAnsweres[studentIndex].rooms[roomCode].qSkkiped = [];
    studentsAnsweres[studentIndex].rooms[roomCode].score = 0;
    studentsAnsweres[studentIndex].rooms[roomCode].totalTime = 0;
  }

  console.log(studentsAnsweres[studentIndex].rooms[roomCode]);
  studentsAnsweres[studentIndex].rooms[roomCode].qSkkiped.push({
    qIndex,
    questionId,
    teacherId,
    date,
  });

  return res.status(201).json({ status: "input recorded", data: studentsAnsweres });
}

exports.createQuizRooms = (req, res, next) => {
  const quizRoom = req.body.roomCode;
  const name = req.body.name;

  for (let i = 0; i < quizRooms.length; i++) {
    if (quizRooms[i].roomId === quizRoom) {
      return res.status(201).json({
        status: false,
        message: `Room with ID ${quizRoom} already exists`,
      });
    }
  }
  quizRooms.push({
    roomId: quizRoom,
    name,
    createdAt: new Date(),
  });

  return res.status(201).json({
    status: true,
    message: `Room created with ID ${quizRoom}`,
  });
};