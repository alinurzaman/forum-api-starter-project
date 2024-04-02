const RawComment = require('../RawComment');

describe('a RawComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'new comment',
    };

    // Action and Assert
    expect(() => new RawComment(payload)).toThrowError('RAW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new RawComment(payload)).toThrowError('RAW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should get rawComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
      isDeleted: false,
    };

    // Action
    const threadComment = new RawComment(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.content).toEqual(payload.content);
    expect(threadComment.isDeleted).toEqual(payload.isDeleted);
  });
});
