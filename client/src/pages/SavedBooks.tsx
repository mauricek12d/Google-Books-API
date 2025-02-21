import { useQuery, useMutation, ApolloCache } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// Define the structure of a Book
interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description?: string;
  image?: string;
}

// Define the structure of the User
interface User {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
}

// Define the structure for RemoveBookResponse
interface RemoveBookResponse {
  removeBook: {
    _id: string;
    savedBooks: Book[];
  };
}

const SavedBooks = () => {
  // Apollo Query to fetch user data
  const { loading, data } = useQuery<{ me: User }>(GET_ME);
  const userData = data?.me || { _id: '', username: '', email: '', savedBooks: [] };

  // Apollo Mutation to remove a saved book
  const [removeBook] = useMutation<RemoveBookResponse>(REMOVE_BOOK, {
    update(cache: ApolloCache<any>, { data }: { data: RemoveBookResponse }) {
      if (data?.removeBook) {
        cache.writeQuery({
          query: GET_ME,
          data: { me: data.removeBook },
        });
      }
    },
  });

  // Handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data?.removeBook) {
        removeBookId(bookId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => (
            <Col md='4' key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors?.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
