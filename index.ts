import { GraphQLServer } from "graphql-yoga"
import fetch  from "node-fetch"

const typeDefs = `
  type Query {
    getPerson(id: Int!): Person
  }
  type Planet {
    name: String
    rotation_period: String
    orbital_period: String
    films: [Film]
  }
  type Film {
    title: String
    episode_id: Int
    opening_crawl: String
    director: String
    producer: String
    release_date: String
  }
  type Person {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    films: [Film]
    homeworld: Planet
  }
`;

interface IPlanet {
  name: string
  rotation_period: string
  orbital_period: string
  films: string[]
}

interface IPerson {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  films: string[]
  homeworld: string
}

const resolveFilms = (parent: IPlanet | IPerson) => {
  const promises = parent.films.map(async (url) => {
    const response = await fetch(url);
    return response.json()
  });

  return Promise.all(promises);
};

const resolvers = {
  Planet: {
    films: resolveFilms
  },
  Person: {
    homeworld: async (parent: IPerson) => {
      const response = await fetch(parent.homeworld);
      return response.json()
    },
    films: resolveFilms
  },
  Query: {
    getPerson: async (_: unknown, { id }: { id: number }) => {
      const response = await fetch(`https://swapi.dev/api/people/${id}/`);
      return response.json()
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));