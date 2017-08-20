port module TwisprApi exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode exposing (..)

main =
  Html.programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

twhisperApiUrl = "http://api.twhispr.com.twhispr.com/v1/"

type alias Model =
    { accountId: Int
    , lastId: String
    , lastError: String
    }

type alias Flags =
    { accountId: Int
    }

type alias QueryOpts =
    { limit: Maybe Int
    , maxId: Maybe String
    }

type alias ApiResponse =
    { results: List Decode.Value
    , audioSource: Maybe String
    , error: Maybe String
    }

-- UPDATE

type Msg = Init
    | Fetch String
    | Query QueryOpts
    | Fetched (Result Http.Error ApiResponse)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Init ->
        (model, Cmd.none)
    Fetch id ->
        (model, fetchById model.accountId <| Debug.log "fetching by id " id)
    Query opts ->
        let limit = Maybe.withDefault 10 opts.limit
            maxId = Maybe.withDefault model.lastId opts.maxId
        in
            (model, fetchMore model.accountId { limit = limit, maxId = maxId })
    Fetched (Ok response) ->
        ({ model | lastId = Debug.log "saving last tweet id as " <| getLastTweetId response.results }, results response)
    Fetched (Err err) ->
        ({ model | lastError = Debug.log "fetch FAILED" (toString err) }, Cmd.none)


-- VIEW

view : Model -> Html Msg
view model =
    div [] []


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
      [ getTweet Fetch
      , getMore Query
      ]


-- PORTS

-- ports for sending to js
port results : ApiResponse -> Cmd msg

-- port for listening for data from JavaScript
port getTweet : (String -> msg) -> Sub msg
port getMore : (QueryOpts -> msg) -> Sub msg

-- HTTP

fetchById : Int -> String -> Cmd Msg
fetchById accountId id =
    let url = twhisperApiUrl ++ "fetch/" ++ (toString accountId) ++ "/" ++ id
        request =
           Http.get url decodeResponse
    in
       Http.send Fetched request

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

        --(if not <| limit == "" then "limit=" ++ ((Maybe.withDefault "10" limit) |> toString) else "") ++
        --(if not <| maxId == "" then "&max=" ++ maxId else "")

        request =
           Http.get apiUrl decodeResponse
    in
       Http.send Fetched request


apiResponseDecoder = Decode.map3 ApiResponse (Decode.field "results" (Decode.list Decode.value))
    (Decode.maybe <| Decode.field "audioSource" Decode.string)
    (Decode.maybe <| Decode.field "error" Decode.string)

decodeResponse : Decode.Decoder ApiResponse
decodeResponse =
    apiResponseDecoder

-- functions

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

emptyResponse : ApiResponse
emptyResponse =
    { results = []
    , audioSource = Just ""
    , error = Just ""
    }

init : Flags -> (Model, Cmd Msg)
init flags =
  ( Model flags.accountId "" ""
  , Cmd.none
  )

