module Update exposing (..)

import Json.Decode as Decode exposing (..)
import RemoteData exposing (WebData)
import Msgs exposing (Msg)
import Models exposing (Model)
import Commands exposing (fetchById, fetchRandom, fetchMore)
import Ports exposing (results)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Msgs.Fetch id ->
        (model, fetchById model.accountId id)
    Msgs.FetchRandom opts ->
        (model, fetchRandom model.accountId)
    Msgs.Query opts ->
        let limit = Maybe.withDefault 10 opts.limit
            maxId = Maybe.withDefault model.lastId opts.maxId
        in
            (model, fetchMore model.accountId { limit = limit, maxId = maxId })
    Msgs.OnFetchData response ->
        case response of
            RemoteData.NotAsked -> (model, Cmd.none)
            RemoteData.Loading -> (model, Cmd.none)
            RemoteData.Success data ->
                -- send payload via the 'results' port
                ({ model | lastId = getLastTweetId data.results }, results data)
            RemoteData.Failure err ->
                ({ model | lastError = Debug.log "fetch FAILED" (toString err) }, Cmd.none)


getLastTweetId : List Decode.Value -> String
getLastTweetId tweets =
    let t = List.reverse tweets |> List.head
    in
       case t of
           Nothing -> ""
           Just obj ->
               case Decode.decodeValue (Decode.field "tid" Decode.string) obj of
                   Ok val -> val
                   Err _ -> ""


