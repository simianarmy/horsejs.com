module Routing exposing (..)

import Navigation exposing (Location)
import Models exposing (TweetId, Route(..))
import UrlParser exposing (..)

matchers : Parser (Route -> a) a
matchers =
    oneOf
    [ map TweetsRoute top
    , map TweetRoute (string)
    ]

parseLocation : Location -> Route
parseLocation location =
    case (parseHash matchers <| Debug.log "location" location) of
        Just route ->
            route
        Nothing ->
            NotFoundRoute

tweetPath : TweetId -> String
tweetPath id =
    "#" ++ id
