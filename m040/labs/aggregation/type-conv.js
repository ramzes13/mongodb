// Insert document with last_visited field:

db.address.insert({
  street: "Rector st",
  building: NumberInt(10),
  _id: 5,
  last_visited: { year: 2017, month: 10 }
})

// Add 15 months to month date field:

db.address.aggregate([
  {
    $addFields: {
      next_visit: {
        $convert: {
          input: {
            $dateFromParts: {
              year: "$last_visited.year",
              month: { $add: [15, "$last_visited.month"] },
            }
          },
          to: "date",
          onNull: "",
          onError: ""
        }
      }
    }
  }
])

// Aggregation pipeline that results in an conversion error:
db.address.aggregate([
  {
    $addFields: {
      building: { $convert: { input: "$building", to: "int" } }
    }
  },
  { $sort: { building: 1 } }
])
// Using $trim to avoid conversion error:

db.address.aggregate([
  { $match: { building: { $type: "string" } } },
  {
    $addFields: {
      building: {
        $convert: {
          input: { $trim: { input: "$building", chars: "w" } },
          to: "int"
        }
      }
    }
  },
  { $sort: { building: 1 } }])

// Using $trim expression with longer list of chars to remove:

db.address.aggregate([
  { $match: { building: { $type: "string" } } },
  {
    $addFields: {
      building: {
        $convert: {
          input: {
            $trim: {
              input: "$building",
              chars: "abcdefghijklmnopqrstuvwxyz "
            }
          },
          to: "int"
        }
      }
    }
  },
  { $sort: { building: 1 } }
])