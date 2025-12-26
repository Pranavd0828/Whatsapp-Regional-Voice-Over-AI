import express from 'express';
import dotenv from 'dotenv';
import { WhatsappService } from './services/whatsapp.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

const whatsappService = new WhatsappService();

app.post('/webhook', (req, res) => {
    whatsappService.handleIncomingMessage(req, res);
});

app.get('/', (req, res) => {
    res.send('WhatsApp Voice Over Bot is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
