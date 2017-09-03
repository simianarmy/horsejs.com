module Update exposing (..)

import List.Extra exposing (splitWhen)
import Msgs exposing (Msg)
import Models exposing (Model, Tweet, TweetId, Route)
import Routing exposing (parseLocation)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        Msgs.NoOp ->
            (model, Cmd.none)

        Msgs.AddTweets tweets ->
            let model_ =
                { model |
                tweets = tweets
                }
            in
               (model_, Cmd.none)

        Msgs.OnLocationChange location ->
            let newRoute = Debug.log "new route" <| parseLocation location
                model_ = { model | route = newRoute }
            in
               case newRoute of
                   Models.TweetRoute tid ->
                       ({ model_ |
                       tweets = Debug.log "remaining: " <| dropUpTo tid model.tweets
                       },
                       Cmd.none)
                   _ -> (model_, Cmd.none)

dropUpTo : TweetId -> List Tweet -> List Tweet
dropUpTo tid list =
    case splitWhen (\t -> t.tid == tid) list of
        Just (a, b) -> b
        _ -> list
