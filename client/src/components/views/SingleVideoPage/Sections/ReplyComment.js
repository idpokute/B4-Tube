import React, { useState, useEffect } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentCount, setChildCommentCount] = useState(0);
  const [ExpandList, setExpandList] = useState(false);

  useEffect(() => {
    let commentCount = 0;

    props.comments.map(comment => {
      if (comment.responseTo === props.parentCommentId) {
        commentCount++;
      }
    });

    setChildCommentCount(commentCount);
  }, [props.comments, props.parentCommentId]);

  const renderReplyComment = parentCommentId =>
    props.comments.map((comment, index) => {
      return (
        <React.Fragment key={index}>
          {comment.responseTo === parentCommentId && (
            <div key={index} style={{ marginLeft: '40px' }}>
              <SingleComment
                refreshFunction={props.refreshFunction}
                comment={comment}
                postId={props.postId}
              />
              <ReplyComment
                parentCommentId={comment._id}
                postId={props.postId}
                comments={props.comments}
                refreshFunction={props.refreshFunction}
              />
            </div>
          )}
        </React.Fragment>
      );
    });

  const onClick = e => {
    setExpandList(!ExpandList);
  };

  return (
    <div>
      {ChildCommentCount > 0 && (
        <span onClick={onClick}>View {ChildCommentCount} comments</span>
      )}

      {ExpandList && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
