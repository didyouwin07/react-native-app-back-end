const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

var initialData = [
  {
    id: "1",
    title:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    content:
      "Lorem ipsum has been the industry's standard dummy text ever since the 1550s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
  },
];

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
        return _.find(initialData, { id: args.id });
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
        contacts.push(contact);
        console.log(contacts);
        return contact;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
