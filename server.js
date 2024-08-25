const express = require('express');
const mongoose = require("mongoose")

const app = express()
const port = 3000;
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/crud-operation").then(() => {
    console.log("Data base connected")
}).catch((err) => {
    console.log(err, 'find mongo db error')
})

const employeeSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    role: {
        required: true,
        type: String
    },
    experience: {
        required: true,
        type: Number
    },
})

const employeeModel = mongoose.model("EmployeeData", employeeSchema);

app.post('/crud-postdata', async (req, res) => {
    const { name, role, experience } = req.body
    try {
        const postEmployeeData = new employeeModel({ name, role, experience })
        await postEmployeeData.save()
        res.status(201).json(postEmployeeData);
    } catch (error) {
        console.log(error, 'find post method mongodb error')
        res.status(500).json({ message: error.message })
    }


})

app.get("/crud-getdata", async (req, res) => {
    try {
        const getEmployeeData = await employeeModel.find();
        res.json(getEmployeeData)
    } catch (error) {
        console.log(error, 'find get method mongodb error')
        res.status(500).json({ message: error.message })
    }
})

app.put("/crud-updatedata/:id", async (req, res) => {
    try {
        const { name, role, experience } = req.body;
        const id = req.params.id;
        const updateEmployeeData = await employeeModel.findByIdAndUpdate(
            id,
            { name, role, experience },
            { new: true }
        )
        if (!updateEmployeeData) {
            return res.status(500).json({ message: "Update id is missing" })
        }
        res.json(updateEmployeeData)
    } catch (error) {
        console.log(error, 'find update method mongodb error')
        res.status(500).json({ message: error.message })
    }
})

app.delete("/crud-deletedata/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await employeeModel.findByIdAndDelete(id);
        res.end();
    } catch (error) {
        console.log(error, 'find delete method mongodb error')
        res.status(500).json({ message: error.message })
    }
})

app.listen(port, () => {
    console.log("Server is working on port : " + port)
})