const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SecretPass",
  database: "my_db",
});
var initialData = {};
connection.connect(function (err) {
  if (err) console.log(err);
  connection.query(
    `INSERT INTO homepagedetails (title,content,id) values("Lorem ipsum is simply dummy text of the printing and typesetting industry.","Lorem ipsum has been the industry's standard dummy text ever since the 1550s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",1)`,
    function (error, result) {
      // console.log(error);
      if (error) throw error;
      console.log(result);
      console.log("Home page details addition success");
    }
  );
  connection.query(`SELECT * FROM homepagedetails WHERE id=1`, function (
    error,
    result
  ) {
    // console.log(error);
    if (error) throw error;
    console.log(result[0].id);
    initialData = {
      title: result[0].title,
      content: result[0].content,
      id: result[0].id,
    };
    console.log("Home page details addition success");
  });
});

var contacts = [];

const HomePageDetailsType = new GraphQLObjectType({
  name: "HomePageDetails",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const ContactType = new GraphQLObjectType({
  name: "Contact",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    HomePageDetails: {
      type: HomePageDetailsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(initialData, { id: args.id });
        return initialData;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addContact: {
      type: ContactType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let contact = {
          name: args.name,
          email: args.email,
          message: args.message,
          id: contacts.length + 1,
        };
        var values = [[args.name, args.email, args.message]];
        contacts.push(contact);

        console.log(contacts);

        connection.connect(function (err) {
          if (err) console.log(err);
          connection.query(
            "INSERT INTO contactdetails (name, email, message) values (?)",
            values,
            function (error, result) {
              // console.log(error);
              if (error) throw error;
              console.log(result);
              console.log("contact details addition success");
            }
          );
        });

        return contact;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
