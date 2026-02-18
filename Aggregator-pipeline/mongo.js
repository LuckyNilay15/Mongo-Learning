const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name - CHANGE THIS if your database name is different
const dbName = 'test'; 

async function main() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('teachers');

    // It is used for the aggregation query. 
    // The result of one operation will act as the input for the next operation 
    // For example: We need to take out the male students from the group of students
    // Then we will pass this to the next operation as input let say group wrt age
    // Now we need to sort the groups so we pass the group male student as input to the sorting function.
    // Insert dummy data
    await collection.deleteMany({}); // Start with a clean slate
    const teachers = [
      { name: "John", gender: "male", age: 30 },
      { name: "Jane", gender: "female", age: 25 },
      { name: "Bob", gender: "male", age: 40 },
      { name: "Alice", gender: "female", age: 35 },
      { name: "Charlie", gender: "male", age: 28 },
      {name:"A",gender:"male",age:30},
      {name:"B",gender:"male",age:40},
      {name:"C",gender:"male",age:28}
    ];
    await collection.insertMany(teachers);
    console.log('Inserted dummy teachers');

    const result = await collection.aggregate([
      { $match: { gender: "male" } }
    ]).toArray();

    const result2 = await collection.aggregate([{ $group: { _id: "$age",names:{$push:"$name"} } }]).toArray();
      const result3 = await collection.aggregate([
          { $group: { _id: "$age", alldoc: { $push: "$$ROOT" } } }
      ]).toArray();

      console.log('Aggregation Result:', result);
      console.log("Grouped aggreagate res", result2);
      console.log("Grouped aggreagate res all docs", result3);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

main();