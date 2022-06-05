let testData = [
  {
    name: 'Erik Thorelli',
    ward: '1',
    bed: '10',
    date: 'Today',
    status: 'pending',
    id: '1',
  },
  {
    name: 'John Doe',
    ward: '4',
    bed: '10',
    date: 'Today',
    status: 'approved',
    id: '2',
  },
  {
    name: 'Apple Seed',
    ward: '3',
    bed: '10',
    date: 'Today',
    status: 'pending',
    id: '3',
  },
  {
    name: 'Apple Seed',
    ward: '3',
    bed: '10',
    date: 'Today',
    status: 'rejected',
    id: '3',
  },
];

let visitationData = {}

let getData = () => {
  fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
    .then((data) => {
      return data.json()
    })
    .then(jsonData => {
      let finObj = []
      let items = jsonData.Items
      for (let i = 0; i < items.length; i++) {
        let newObj = {}
        newObj.name = items[i].Visitor
        newObj.date = items[i].DateTime
        newObj.id = items[i].ID
        newObj.status = 'rejected'
        newObj.ward = '3'
        newObj.bed = '10'
        finObj.push(newObj)
      }
      return finObj
    })
    .then(obj => {
      visitationData = obj
    })
    .catch((err) => {
      console.log(err)
    })
}


module.exports = { visitationData }
