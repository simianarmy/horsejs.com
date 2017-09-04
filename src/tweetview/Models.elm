module Models exposing (..)

import List
import List.Extra exposing (splitWhen, takeWhileRight)

type alias TweetId = String

type alias Tweet =
    { tid: TweetId
    , words: List String
    }

type alias Model =
    { tweets: List Tweet
    , wordCountVisible: Int
    , route: Route
    , currentTweetId: (Maybe TweetId)
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
    , currentTweetId = Nothing
    }

emptyTweet : Tweet
emptyTweet =
    Tweet "" []

getTweetById : TweetId -> List Tweet -> Maybe Tweet
getTweetById id tweets =
    let found =List.filter (\t -> id == t.tid) tweets
    in
       List.head found

dropUpTo : TweetId -> List Tweet -> List Tweet
dropUpTo tid list =
    takeWhileRight (\t -> not (t.tid == tid)) list

maybeDropUpTo : Maybe TweetId -> List Tweet -> List Tweet
maybeDropUpTo tid list =
    case tid of
        Just t -> dropUpTo t list
        Nothing -> list
