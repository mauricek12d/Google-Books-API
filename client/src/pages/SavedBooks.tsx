import { useQuery, useMutation, ApolloCache, FetchResult } from '@apollo/client';
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
  removeBook: User;
  }

const SavedBooks = () => {
  // Apollo Query to fetch user data
  const { loading, data, refetch } = useQuery<{ me: User }>(GET_ME);
  const userData = data?.me || { _id: '', username: '', email: '', savedBooks: [] };

  // Apollo Mutation to remove a saved book
  const [removeBook] = useMutation<RemoveBookResponse>(REMOVE_BOOK, {
    update(cache: ApolloCache<any>, { data }: FetchResult<RemoveBookResponse>) {
      if (!data?.removeBook) return;

    
      cache.modify({
        id: `User:${data.removeBook._id}`,
        fields: {
          savedBooks(existingBooksRefs = [], { readField }) {
            return existingBooksRefs.filter(
              (bookRef: any) => readField('bookId', bookRef) !== <data value="" className="removeBook _id"></data>
            );
          },
        },
      });
    },
  });

  // Handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return;

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data?.removeBook) {
        removeBookId(bookId);
        await refetch();
      }
    } catch (err) {
      console.error('Error deleting book:',err);
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
