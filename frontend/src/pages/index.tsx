import React, { FormEvent, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import Link from "next/link";

interface NewCountryInput {
  name: string;
  emoji: string;
  code: string;
  continent: {
    id: number;
  };
}

interface CountryData {
  addCountry: {
    name: string;
    emoji: string;
    code: string;
    continent: {
      id: number;
    };
  };
}

interface Country {
  name: string;
  emoji: string;
  code: string;
}

interface Continent {
  id: string;
  name: string;
}

const GET_COUNTRIES_QUERY = gql`
  query Query {
    countries {
      name
      emoji
      code
    }
  }
`;

const GET_CONTINENTS_QUERY = gql`
  query Continents {
    continents {
      id
      name
    }
  }
`;

const ADD_COUNTRY_MUTATION = gql`
  mutation Mutation($data: NewCountryInput!) {
    addCountry(data: $data) {
      name
      emoji
      code
      continent {
        id
      }
    }
  }
`;

export default function Home() {
  const [
    addCountry,
    { data, loading: addingCountryLoading, error: addingCountryError },
  ] = useMutation<CountryData, { data: NewCountryInput }>(ADD_COUNTRY_MUTATION);

  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
  } = useQuery<{ countries: Country[] }>(GET_COUNTRIES_QUERY);

  const {
    data: continentData,
    loading: continentLoading,
    error: continentError,
  } = useQuery<{ continents: Continent[] }>(GET_CONTINENTS_QUERY);

  useEffect(() => {
    if (countriesError) {
      console.error("Error fetching countries:", countriesError.message);
    }
    if (continentError) {
      console.error("Error fetching continents:", continentError.message);
    }
    if (addingCountryError) {
      console.error("Error adding country:", addingCountryError.message);
    }
  }, [countriesError, continentError, addingCountryError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      emoji: { value: string };
      code: { value: string };
      continent: { value: string };
    };
    const name = target.name.value;
    const emoji = target.emoji.value;
    const code = target.code.value;
    const continentId = parseInt(target.continent.value, 10);

    try {
      const response = await addCountry({
        variables: {
          data: {
            name,
            emoji,
            code,
            continent: {
              id: continentId,
            },
          },
        },
      });
      console.log("Country added:", response.data?.addCountry);
    } catch (err) {
      console.error("Error adding country:", err);
    }
  };

  if (continentLoading || countriesLoading) return <p>Loading...</p>;

  return (
    <section>
      <div className="container mx-auto px-4 border-gray-500 border-2 border-solid mt-10">
        <form
          className="max-w-lg mx-auto mt-10 flex flex-col xl:flex-row justify-between items-center gap-5"
          onSubmit={handleSubmit}
        >
          <section className="flex flex-col xl:flex-row gap-5 w-full">
            <div className="mb-6 flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6 flex-1">
              <label
                htmlFor="emoji"
                className="block text-sm font-medium text-gray-700"
              >
                Emoji
              </label>
              <input
                type="text"
                id="emoji"
                name="emoji"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6 flex-1">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6 flex-1">
              <label
                htmlFor="continent"
                className="block text-sm font-medium text-gray-700"
              >
                Continent
              </label>
              <select
                id="continent"
                name="continent"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a Continent</option>
                {continentData?.continents.map((continent) => (
                  <option key={continent.id} value={continent.id}>
                    {continent.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="flex justify-center xl:justify-start xl:flex-1">
            <button
              type="submit"
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {countriesData?.countries.map((country, index) => (
          <Link
            key={index}
            href={`/countries/${encodeURIComponent(country.code)}`}
          >
            <div className="border-2 border-gray-500 p-4 flex flex-col items-center justify-center cursor-pointer">
              <p>{country.emoji}</p>
              <p>{country.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
