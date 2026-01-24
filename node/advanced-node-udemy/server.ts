import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(
    "Why did the banana go to the doctor? Because it wasn't peeling well!",
  );
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}. In 3000 BC, the first known use of the wheel for transportation was recorded by the Sumerians.Th Sumerians lived in ancient Mesopotamia, which is present-day Iraq. They also developed one of the earliest known writing systems, cuneiform. My dog loves to chase wheels!`,
  );
});
