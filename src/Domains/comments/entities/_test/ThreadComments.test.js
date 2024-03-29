const ThreadComment = require('../ThreadComment');

describe('a ThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'new comment',
    };

    // Action and Assert
    expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    };

    // Action and Assert
    expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should get threadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    };

    // Action
    const threadComment = new ThreadComment(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.content).toEqual(payload.content);
  });
});
