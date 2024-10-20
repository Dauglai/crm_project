import React from "react";
import PostItem from "./PostItem";
import { CSSTransition, TransitionGroup} from 'react-transition-group';

const PostList = ({posts, title, remove}) => {
    return (
        <div>
            {posts.length > 0
                ? <h1 style={{textAlign: 'center'}}>{title}</h1>
                : <h1 style={{textAlign: 'center'}}>No list item</h1>}

            <TransitionGroup>
                {posts.map( (post) =>
                    <CSSTransition
                        key={post.id}
                        timeout={500}
                        classNames="post"
                    >
                        <PostItem remove={remove} post={post} />
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    )
};

export default PostList;