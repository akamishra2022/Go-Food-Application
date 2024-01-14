
const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://Gofood:Gofood21@cluster0.aryj9nh.mongodb.net/gofoodmern?retryWrites=true&w=majority';


const connectDB = async () => {


  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
    if (err) console.log("---", err)
    else {
      console.log("Connected to Mongo Successfully!");
      const fetched_data = await mongoose.connection.db.collection("food_items");

      fetched_data.find({}).toArray(async function (err, data) {
        const foodCategory = await mongoose.connection.db.collection("foodCategory");
        foodCategory.find({}).toArray(function (err, catData) {
          if (err) console.log(err);
          else {
            global.food_items = data;
            global.foodCategory = catData;
          }

        })
      })
    }
  });

}
module.exports = connectDB;




