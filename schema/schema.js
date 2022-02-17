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
    `INSERT INTO homepagedetails (name,profession,id) values("Vishwas","Software Engineer",1)`,
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
      name: result[0].name,
      profession: result[0].profession,
      id: result[0].id,
    };
    console.log("Home page details addition success");
  });
});

var images = [];

const HomePageDetailsType = new GraphQLObjectType({
  name: "HomePageDetails",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    profession: { type: GraphQLString },
  }),
});

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
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
    addImage: {
      type: ImageType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let image = {
          name: args.name,
          image: args.image,
          id: images.length + 1,
        };
        var values = [[args.name, args.image]];
        images.push(image);

        console.log(images);

        connection.connect(function (err) {
          if (err) console.log(err);
          connection.query(
            "INSERT INTO imagedetails (name, image) values (?)",
            values,
            function (error, result) {
              // console.log(error);
              if (error) throw error;
              console.log(result);
              console.log("Image addition success");
            }
          );
        });

        return image;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
