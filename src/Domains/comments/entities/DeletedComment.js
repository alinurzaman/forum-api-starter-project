class DeletedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, isDeleted } = payload;

    this.id = id;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({ id, isDeleted }) {
    if (!id || isDeleted == null) {
      throw new Error('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedComment;
