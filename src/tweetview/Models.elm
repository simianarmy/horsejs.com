module Models exposing (..)

import List

type alias TweetId = String

type alias Tweet =
    { tid: TweetId
    , words: List String
    }

type alias Model =
    { tweets: List Tweet
    , wordCountVisible: Int
    , route: Route
    }

type Route
    = TweetsRoute
    | TweetRoute TweetId
    | NotFoundRoute

initialModel : Route -> Model
initialModel route =
    { tweets = []
    , wordCountVisible = 0
    , route = route
    }

emptyTweet : Tweet
emptyTweet =
    Tweet "" []

getTweetById : TweetId -> List Tweet -> Maybe Tweet
getTweetById id tweets =
    let found =List.filter (\t -> id == t.tid) tweets
    in
       List.head found
