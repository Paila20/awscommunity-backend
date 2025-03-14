const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

const adminRoutes = require('./Routes/adminRouter');

const teamRoutes = require('./Routes/TeamRouter');
const joinusRoutes = require('./Routes/JoinUsRouter');
const eventRoutes = require('./Routes/EventRouter');
const sectionRoutes = require('./Routes/SectionRouter');
const pageRoutes = require('./Routes/PageRouter');



require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => {
    res.send('PONG');
});








app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);

app.use('/admin', adminRoutes); 

app.use('/api',teamRoutes);

app.use('/api',eventRoutes);
app.use('/api',sectionRoutes);
app.use('/api',pageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})