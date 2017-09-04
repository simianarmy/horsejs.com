module Update exposing (..)

import Msgs exposing (Msg)
import Models exposing (Model, Tweet, TweetId, Route, dropUpTo, maybeDropUpTo)
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
                       currentTweetId = Just tid
                       },
                       Cmd.none)
                   _ -> (model_, Cmd.none)

        Msgs.ShowNext ->
            case Debug.log "looking at tweet id" model.currentTweetId of
                Just t ->
                    let next = Debug.log "found next" <| List.head (maybeDropUpTo model.currentTweetId model.tweets)
                    in
                       ({ model | currentTweetId = Maybe.map .tid next }, Cmd.none)
                Nothing ->
                    let nextUp = Debug.log "found head" <| List.head model.tweets
                    in 
                       ({ model | currentTweetId = Maybe.map .tid nextUp }, Cmd.none)
