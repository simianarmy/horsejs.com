module Msgs exposing (..)

import Models exposing (QueryOpts, ApiResponse)
import RemoteData exposing (WebData)

type Msg = Fetch String
    | Query QueryOpts
    | OnFetchData (WebData ApiResponse)
    | FetchRandom QueryOpts

