module Commands exposing (..)

import Http
import Json.Decode as Decode
--import Json.Decode.Pipeline exposing (decode, required)
import Msgs exposing (Msg)
import Models exposing (Model, ApiResponse)
import RemoteData

-- HTTP

twhisperApiUrl = "http://api.twhispr.com.twhispr.com/v1/"

get : String -> Cmd Msg
get url =
    Http.get url apiResponseDecoder
        |> RemoteData.sendRequest
        |> Cmd.map Msgs.OnFetchData

fetchById : Int -> String -> Cmd Msg
fetchById accountId id =
    get <| twhisperApiUrl ++ "fetch/" ++ (toString accountId) ++ "/" ++ id

fetchRandom : Int -> Cmd Msg
fetchRandom accountId =
    get <| twhisperApiUrl ++ "rand/" ++ (toString accountId)

--fetchMore : Int -> {c} -> Cmd Msg
fetchMore accountId {limit, maxId} =
    let url = twhisperApiUrl ++ "more/" ++ (toString accountId)
        limitOpt = Debug.log "limit " (toString limit)
        maxIdOpt = Debug.log "maxid " maxId
        qs = List.filter (\e -> not (String.isEmpty (Tuple.second e))) [("limit", limitOpt), ("maxid", maxIdOpt)]
            |> List.map (\t -> (Tuple.first t) ++ "=" ++ (Tuple.second t))
            |> List.intersperse "&"
            |> String.concat
        apiUrl = url ++ "?" ++ qs
    in
       get apiUrl

apiResponseDecoder : Decode.Decoder ApiResponse
apiResponseDecoder = Decode.map3 ApiResponse (Decode.field "results" (Decode.list Decode.value))
    (Decode.maybe <| Decode.field "audioSource" Decode.string)
    (Decode.maybe <| Decode.field "error" Decode.string)

-- functions

emptyResponse : ApiResponse
emptyResponse =
    { results = []
    , audioSource = Just ""
    , error = Just ""
    }
