import React, {useState} from 'react';
import {useQuery, gql, useLazyQuery, useMutation} from '@apollo/client';

const GET_DATA_LIST = gql`
  query Getallusers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;
const GET_ALL_MOVIES = gql`
  query Getallmovies {
    movies {
      name
      yearOfPublication
    }
  }
`;

const GET_MOVIE = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      username
      age
      nationality
    }
  }
`;

function DisplayData() {
  const [movieInput, setMovieInput] = useState('');
  //create user input
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState('');

  const {data, loading, error, refetch} = useQuery(GET_DATA_LIST);
  const {data: movieData} = useQuery(GET_ALL_MOVIES);
  const [fetchData, {data: movieDataInput}] = useLazyQuery(GET_MOVIE);

  const [InputUser] = useMutation(CREATE_USER);

  if (loading) {
    return <div>Data is Loading</div>;
  }

  if (error) {
    console.log(error);
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Interstellar"
        onChange={(e) => setMovieInput(e.target.value)}
      />
      <button
        onClick={() =>
          fetchData({
            variables: {name: movieInput},
          })
        }
      >
        {' '}
        Fetch Data
      </button>
      {movieDataInput && (
        <div>
          {movieDataInput.movie.name} {movieDataInput.movie.yearOfPublication}
        </div>
      )}
      {data &&
        data.users.map((user) => {
          return (
            <div>
              <h2>{user.name}</h2>
              <h2>{user.username}</h2>
              <h2>{user.age}</h2>
              <h2>{user.nationality}</h2>
            </div>
          );
        })}
      <h1>List of Movies</h1>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div>
              <h2>{movie.name}</h2>
              <h2>{movie.yearOfPublication}</h2>
            </div>
          );
        })}

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nationality"
        onChange={(e) => setNationality(e.target.value.toUpperCase())}
      />
      <button
        onClick={() => {
          InputUser({
            variables: {input: {name, username, age: Number(age), nationality}},
          });
          refetch();
        }}
      >
        Create User
      </button>
    </div>
  );
}

export default DisplayData;
