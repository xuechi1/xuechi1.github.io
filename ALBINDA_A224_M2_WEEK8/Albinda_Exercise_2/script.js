const person = {
    name: "James",
    age: 20,
    hobbies: ["Video Games", "Modeling", "Work out ", "Travel"]
  };
  
  const jsonString = JSON.stringify(person);
  const jsonObject = JSON.parse(jsonString);
  
  document.getElementById('output').innerHTML = `
    <p><strong>Name:</strong> ${jsonObject.name}</p>
    <p><strong>Age:</strong> ${jsonObject.age}</p>
    <p><strong>Hobbies:</strong> ${jsonObject.hobbies.join(', ')}</p>
  `;