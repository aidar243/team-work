const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

// Твоя строка подключения
const dbURI = 'mongodb+srv://babataeva_db_user:aidar12345@cluster0.qylwy6r.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Atlas Connected...'))
    .catch(err => console.log('❌ Connection error:', err));

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    date: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// --- Маршруты CRUD ---

// 1. Создать (POST)
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Получить все (GET)
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Удалить (DELETE)
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Удалено успешно" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 4. Обновить (PUT)
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Вернуть уже обновленный документ
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});