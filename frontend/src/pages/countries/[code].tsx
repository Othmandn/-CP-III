import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

const GET_COUNTRY_QUERY = gql`
  query Query($code: String!) {
    country(code: $code) {
      emoji
      code
      name
      continent {
        name
      }
    }
  }
`;

const CountryPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const { data, loading, error } = useQuery(GET_COUNTRY_QUERY, {
    variables: { code },
    skip: !code,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No country found.</p>;

  return (
    <div className="max-w-2xl mx-auto my-12 p-5 border rounded-lg shadow-lg">
      <div className="flex flex-col  space-x-4">
        <p>{data.country.emoji}</p>
        <div className="flex-grow">
          <h1 className="text-lg font-bold">
            {data.country.name} ({data.country.code})
          </h1>
          <p className="text-gray-600">
            Continent: {data.country.continent.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryPage;
