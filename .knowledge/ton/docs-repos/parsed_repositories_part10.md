# GitHub Docs Parser - Part 10

    "doc_stack": "x b l - x b f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STUX`."
  },
  {
    "name": "STIXRQ",
    "alias_of": "",
    "tlb": "#CF06",
    "doc_category": "cell_build",
    "doc_opcode": "CF06",
    "doc_fift": "STIXRQ",
    "doc_stack": "b x l - b x f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STIXR`."
  },
  {
    "name": "STUXRQ",
    "alias_of": "",
    "tlb": "#CF07",
    "doc_category": "cell_build",
    "doc_opcode": "CF07",
    "doc_fift": "STUXRQ",
    "doc_stack": "b x l - b x f or b' 0",
    "doc_gas": 26,
    "doc_description": "A quiet version of `STUXR`."
  },
  {
    "name": "STI_ALT",
    "alias_of": "",
    "tlb": "#CF08 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF08cc",
    "doc_fift": "[cc+1] STI_l",
    "doc_stack": "x b - b'",
    "doc_gas": 34,
    "doc_description": "A longer version of `[cc+1] STI`."
  },
  {
    "name": "STU_ALT",
    "alias_of": "",
    "tlb": "#CF09 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF09cc",
    "doc_fift": "[cc+1] STU_l",
    "doc_stack": "x b - b'",
    "doc_gas": 34,
    "doc_description": "A longer version of `[cc+1] STU`."
  },
  {
    "name": "STIR",
    "alias_of": "",
    "tlb": "#CF0A cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Acc",
    "doc_fift": "[cc+1] STIR",
    "doc_stack": "b x - b'",
    "doc_gas": 34,
    "doc_description": "Equivalent to `SWAP` `[cc+1] STI`."
  },
  {
    "name": "STUR",
    "alias_of": "",
    "tlb": "#CF0B cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Bcc",
    "doc_fift": "[cc+1] STUR",
    "doc_stack": "b x - b'",
    "doc_gas": 34,
    "doc_description": "Equivalent to `SWAP` `[cc+1] STU`."
  },
  {
    "name": "STIQ",
    "alias_of": "",
    "tlb": "#CF0C cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Ccc",
    "doc_fift": "[cc+1] STIQ",
    "doc_stack": "x b - x b f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STI`."
  },
  {
    "name": "STUQ",
    "alias_of": "",
    "tlb": "#CF0D cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Dcc",
    "doc_fift": "[cc+1] STUQ",
    "doc_stack": "x b - x b f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STU`."
  },
  {
    "name": "STIRQ",
    "alias_of": "",
    "tlb": "#CF0E cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Ecc",
    "doc_fift": "[cc+1] STIRQ",
    "doc_stack": "b x - b x f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STIR`."
  },
  {
    "name": "STURQ",
    "alias_of": "",
    "tlb": "#CF0F cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF0Fcc",
    "doc_fift": "[cc+1] STURQ",
    "doc_stack": "b x - b x f or b' 0",
    "doc_gas": 34,
    "doc_description": "A quiet version of `STUR`."
  },
  {
    "name": "STREF_ALT",
    "alias_of": "",
    "tlb": "#CF10",
    "doc_category": "cell_build",
    "doc_opcode": "CF10",
    "doc_fift": "STREF_l",
    "doc_stack": "c b - b'",
    "doc_gas": 26,
    "doc_description": "A longer version of `STREF`."
  },
  {
    "name": "STBREF",
    "alias_of": "",
    "tlb": "#CF11",
    "doc_category": "cell_build",
    "doc_opcode": "CF11",
    "doc_fift": "STBREF",
    "doc_stack": "b' b - b''",
    "doc_gas": 526,
    "doc_description": "Equivalent to `SWAP` `STBREFR`."
  },
  {
    "name": "STSLICE_ALT",
    "alias_of": "",
    "tlb": "#CF12",
    "doc_category": "cell_build",
    "doc_opcode": "CF12",
    "doc_fift": "STSLICE_l",
    "doc_stack": "s b - b'",
    "doc_gas": 26,
    "doc_description": "A longer version of `STSLICE`."
  },
  {
    "name": "STB",
    "alias_of": "",
    "tlb": "#CF13",
    "doc_category": "cell_build",
    "doc_opcode": "CF13",
    "doc_fift": "STB",
    "doc_stack": "b' b - b''",
    "doc_gas": 26,
    "doc_description": "Appends all data from _Builder_ `b'` to _Builder_ `b`."
  },
  {
    "name": "STREFR",
    "alias_of": "",
    "tlb": "#CF14",
    "doc_category": "cell_build",
    "doc_opcode": "CF14",
    "doc_fift": "STREFR",
    "doc_stack": "b c - b'",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SWAP` `STREF`."
  },
  {
    "name": "STBREFR_ALT",
    "alias_of": "",
    "tlb": "#CF15",
    "doc_category": "cell_build",
    "doc_opcode": "CF15",
    "doc_fift": "STBREFR_l",
    "doc_stack": "b b' - b''",
    "doc_gas": 526,
    "doc_description": "A longer encoding of `STBREFR`."
  },
  {
    "name": "STSLICER",
    "alias_of": "",
    "tlb": "#CF16",
    "doc_category": "cell_build",
    "doc_opcode": "CF16",
    "doc_fift": "STSLICER",
    "doc_stack": "b s - b'",
    "doc_gas": 26,
    "doc_description": "Equivalent to `SWAP` `STSLICE`."
  },
  {
    "name": "STBR",
    "alias_of": "",
    "tlb": "#CF17",
    "doc_category": "cell_build",
    "doc_opcode": "CF17",
    "doc_fift": "STBR\nBCONCAT",
    "doc_stack": "b b' - b''",
    "doc_gas": 26,
    "doc_description": "Concatenates two builders.\nEquivalent to `SWAP` `STB`."
  },
  {
    "name": "STREFQ",
    "alias_of": "",
    "tlb": "#CF18",
    "doc_category": "cell_build",
    "doc_opcode": "CF18",
    "doc_fift": "STREFQ",
    "doc_stack": "c b - c b -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STREF`."
  },
  {
    "name": "STBREFQ",
    "alias_of": "",
    "tlb": "#CF19",
    "doc_category": "cell_build",
    "doc_opcode": "CF19",
    "doc_fift": "STBREFQ",
    "doc_stack": "b' b - b' b -1 or b'' 0",
    "doc_gas": 526,
    "doc_description": "Quiet version of `STBREF`."
  },
  {
    "name": "STSLICEQ",
    "alias_of": "",
    "tlb": "#CF1A",
    "doc_category": "cell_build",
    "doc_opcode": "CF1A",
    "doc_fift": "STSLICEQ",
    "doc_stack": "s b - s b -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STSLICE`."
  },
  {
    "name": "STBQ",
    "alias_of": "",
    "tlb": "#CF1B",
    "doc_category": "cell_build",
    "doc_opcode": "CF1B",
    "doc_fift": "STBQ",
    "doc_stack": "b' b - b' b -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STB`."
  },
  {
    "name": "STREFRQ",
    "alias_of": "",
    "tlb": "#CF1C",
    "doc_category": "cell_build",
    "doc_opcode": "CF1C",
    "doc_fift": "STREFRQ",
    "doc_stack": "b c - b c -1 or b' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STREFR`."
  },
  {
    "name": "STBREFRQ",
    "alias_of": "",
    "tlb": "#CF1D",
    "doc_category": "cell_build",
    "doc_opcode": "CF1D",
    "doc_fift": "STBREFRQ",
    "doc_stack": "b b' - b b' -1 or b'' 0",
    "doc_gas": 526,
    "doc_description": "Quiet version of `STBREFR`."
  },
  {
    "name": "STSLICERQ",
    "alias_of": "",
    "tlb": "#CF1E",
    "doc_category": "cell_build",
    "doc_opcode": "CF1E",
    "doc_fift": "STSLICERQ",
    "doc_stack": "b s - b s -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STSLICER`."
  },
  {
    "name": "STBRQ",
    "alias_of": "",
    "tlb": "#CF1F",
    "doc_category": "cell_build",
    "doc_opcode": "CF1F",
    "doc_fift": "STBRQ\nBCONCATQ",
    "doc_stack": "b b' - b b' -1 or b'' 0",
    "doc_gas": 26,
    "doc_description": "Quiet version of `STBR`."
  },
  {
    "name": "STREFCONST",
    "alias_of": "",
    "tlb": "#CF20 c:^Cell",
    "doc_category": "cell_build",
    "doc_opcode": "CF20",
    "doc_fift": "[ref] STREFCONST",
    "doc_stack": "b - b’",
    "doc_gas": 26,
    "doc_description": "Equivalent to `PUSHREF` `STREFR`."
  },
  {
    "name": "STREF2CONST",
    "alias_of": "",
    "tlb": "#CF21 c1:^Cell c2:^Cell",
    "doc_category": "cell_build",
    "doc_opcode": "CF21",
    "doc_fift": "[ref] [ref] STREF2CONST",
    "doc_stack": "b - b’",
    "doc_gas": 26,
    "doc_description": "Equivalent to `STREFCONST` `STREFCONST`."
  },
  {
    "name": "ENDXC",
    "alias_of": "",
    "tlb": "#CF23",
    "doc_category": "cell_build",
    "doc_opcode": "CF23",
    "doc_fift": "",
    "doc_stack": "b x - c",
    "doc_gas": 526,
    "doc_description": "If `x!=0`, creates a _special_ or _exotic_ cell from _Builder_ `b`.\nThe type of the exotic cell must be stored in the first 8 bits of `b`.\nIf `x=0`, it is equivalent to `ENDC`. Otherwise some validity checks on the data and references of `b` are performed before creating the exotic cell."
  },
  {
    "name": "STILE4",
    "alias_of": "",
    "tlb": "#CF28",
    "doc_category": "cell_build",
    "doc_opcode": "CF28",
    "doc_fift": "STILE4",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian signed 32-bit integer."
  },
  {
    "name": "STULE4",
    "alias_of": "",
    "tlb": "#CF29",
    "doc_category": "cell_build",
    "doc_opcode": "CF29",
    "doc_fift": "STULE4",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian unsigned 32-bit integer."
  },
  {
    "name": "STILE8",
    "alias_of": "",
    "tlb": "#CF2A",
    "doc_category": "cell_build",
    "doc_opcode": "CF2A",
    "doc_fift": "STILE8",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian signed 64-bit integer."
  },
  {
    "name": "STULE8",
    "alias_of": "",
    "tlb": "#CF2B",
    "doc_category": "cell_build",
    "doc_opcode": "CF2B",
    "doc_fift": "STULE8",
    "doc_stack": "x b - b'",
    "doc_gas": 26,
    "doc_description": "Stores a little-endian unsigned 64-bit integer."
  },
  {
    "name": "BDEPTH",
    "alias_of": "",
    "tlb": "#CF30",
    "doc_category": "cell_build",
    "doc_opcode": "CF30",
    "doc_fift": "BDEPTH",
    "doc_stack": "b - x",
    "doc_gas": 26,
    "doc_description": "Returns the depth of _Builder_ `b`. If no cell references are stored in `b`, then `x=0`; otherwise `x` is one plus the maximum of depths of cells referred to from `b`."
  },
  {
    "name": "BBITS",
    "alias_of": "",
    "tlb": "#CF31",
    "doc_category": "cell_build",
    "doc_opcode": "CF31",
    "doc_fift": "BBITS",
    "doc_stack": "b - x",
    "doc_gas": 26,
    "doc_description": "Returns the number of data bits already stored in _Builder_ `b`."
  },
  {
    "name": "BREFS",
    "alias_of": "",
    "tlb": "#CF32",
    "doc_category": "cell_build",
    "doc_opcode": "CF32",
    "doc_fift": "BREFS",
    "doc_stack": "b - y",
    "doc_gas": 26,
    "doc_description": "Returns the number of cell references already stored in `b`."
  },
  {
    "name": "BBITREFS",
    "alias_of": "",
    "tlb": "#CF33",
    "doc_category": "cell_build",
    "doc_opcode": "CF33",
    "doc_fift": "BBITREFS",
    "doc_stack": "b - x y",
    "doc_gas": 26,
    "doc_description": "Returns the numbers of both data bits and cell references in `b`."
  },
  {
    "name": "BREMBITS",
    "alias_of": "",
    "tlb": "#CF35",
    "doc_category": "cell_build",
    "doc_opcode": "CF35",
    "doc_fift": "BREMBITS",
    "doc_stack": "b - x'",
    "doc_gas": 26,
    "doc_description": "Returns the number of data bits that can still be stored in `b`."
  },
  {
    "name": "BREMREFS",
    "alias_of": "",
    "tlb": "#CF36",
    "doc_category": "cell_build",
    "doc_opcode": "CF36",
    "doc_fift": "BREMREFS",
    "doc_stack": "b - y'",
    "doc_gas": 26,
    "doc_description": "Returns the number of references that can still be stored in `b`."
  },
  {
    "name": "BREMBITREFS",
    "alias_of": "",
    "tlb": "#CF37",
    "doc_category": "cell_build",
    "doc_opcode": "CF37",
    "doc_fift": "BREMBITREFS",
    "doc_stack": "b - x' y'",
    "doc_gas": 26,
    "doc_description": "Returns the numbers of both data bits and references that can still be stored in `b`."
  },
  {
    "name": "BCHKBITS",
    "alias_of": "",
    "tlb": "#CF38 cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF38cc",
    "doc_fift": "[cc+1] BCHKBITS#",
    "doc_stack": "b -",
    "doc_gas": "34/84",
    "doc_description": "Checks whether `cc+1` bits can be stored into `b`, where `0 <= cc <= 255`."
  },
  {
    "name": "BCHKBITS_VAR",
    "alias_of": "",
    "tlb": "#CF39",
    "doc_category": "cell_build",
    "doc_opcode": "CF39",
    "doc_fift": "BCHKBITS",
    "doc_stack": "b x -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` bits can be stored into `b`, `0 <= x <= 1023`. If there is no space for `x` more bits in `b`, or if `x` is not within the range `0...1023`, throws an exception."
  },
  {
    "name": "BCHKREFS",
    "alias_of": "",
    "tlb": "#CF3A",
    "doc_category": "cell_build",
    "doc_opcode": "CF3A",
    "doc_fift": "BCHKREFS",
    "doc_stack": "b y -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `y` references can be stored into `b`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITREFS",
    "alias_of": "",
    "tlb": "#CF3B",
    "doc_category": "cell_build",
    "doc_opcode": "CF3B",
    "doc_fift": "BCHKBITREFS",
    "doc_stack": "b x y -",
    "doc_gas": "26/76",
    "doc_description": "Checks whether `x` bits and `y` references can be stored into `b`, `0 <= x <= 1023`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITSQ",
    "alias_of": "",
    "tlb": "#CF3C cc:uint8",
    "doc_category": "cell_build",
    "doc_opcode": "CF3Ccc",
    "doc_fift": "[cc+1] BCHKBITSQ#",
    "doc_stack": "b - ?",
    "doc_gas": 34,
    "doc_description": "Checks whether `cc+1` bits can be stored into `b`, where `0 <= cc <= 255`."
  },
  {
    "name": "BCHKBITSQ_VAR",
    "alias_of": "",
    "tlb": "#CF3D",
    "doc_category": "cell_build",
    "doc_opcode": "CF3D",
    "doc_fift": "BCHKBITSQ",
    "doc_stack": "b x - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `x` bits can be stored into `b`, `0 <= x <= 1023`."
  },
  {
    "name": "BCHKREFSQ",
    "alias_of": "",
    "tlb": "#CF3E",
    "doc_category": "cell_build",
    "doc_opcode": "CF3E",
    "doc_fift": "BCHKREFSQ",
    "doc_stack": "b y - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `y` references can be stored into `b`, `0 <= y <= 7`."
  },
  {
    "name": "BCHKBITREFSQ",
    "alias_of": "",
    "tlb": "#CF3F",
    "doc_category": "cell_build",
    "doc_opcode": "CF3F",
    "doc_fift": "BCHKBITREFSQ",
    "doc_stack": "b x y - ?",
    "doc_gas": 26,
    "doc_description": "Checks whether `x` bits and `y` references can be stored into `b`, `0 <= x <= 1023`, `0 <= y <= 7`."
  },
  {
    "name": "STZEROES",
    "alias_of": "",
    "tlb": "#CF40",
    "doc_category": "cell_build",
    "doc_opcode": "CF40",
    "doc_fift": "STZEROES",
    "doc_stack": "b n - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary zeroes into _Builder_ `b`."
  },
  {
    "name": "STONES",
    "alias_of": "",
    "tlb": "#CF41",
    "doc_category": "cell_build",
    "doc_opcode": "CF41",
    "doc_fift": "STONES",
    "doc_stack": "b n - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary ones into _Builder_ `b`."
  },
  {
    "name": "STSAME",
    "alias_of": "",
    "tlb": "#CF42",
    "doc_category": "cell_build",
    "doc_opcode": "CF42",
    "doc_fift": "STSAME",
    "doc_stack": "b n x - b'",
    "doc_gas": 26,
    "doc_description": "Stores `n` binary `x`es (`0 <= x <= 1`) into _Builder_ `b`."
  },
  {
    "name": "STSLICECONST",
    "alias_of": "",
    "tlb": "#CFC0_ x:(## 2) y:(## 3) c:(x * ^Cell) sss:((8 * y + 2) * Bit)",
    "doc_category": "cell_build",
    "doc_opcode": "CFC0_xysss",
    "doc_fift": "[slice] STSLICECONST",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores a constant subslice `sss`.\n_Details:_ `sss` consists of `0 <= x <= 3` references and up to `8y+2` data bits, with `0 <= y <= 7`. Completion bit is assumed.\nNote that the assembler can replace `STSLICECONST` with `PUSHSLICE` `STSLICER` if the slice is too big."
  },
  {
    "name": "STZERO",
    "alias_of": "STSLICECONST",
    "tlb": "#CF81",
    "doc_category": "cell_build",
    "doc_opcode": "CF81",
    "doc_fift": "STZERO",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores one binary zero."
  },
  {
    "name": "STONE",
    "alias_of": "STSLICECONST",
    "tlb": "#CF83",
    "doc_category": "cell_build",
    "doc_opcode": "CF83",
    "doc_fift": "STONE",
    "doc_stack": "b - b'",
    "doc_gas": 24,
    "doc_description": "Stores one binary one."
  },
  {
    "name": "CTOS",
    "alias_of": "",
    "tlb": "#D0",
    "doc_category": "cell_parse",
    "doc_opcode": "D0",
    "doc_fift": "CTOS",
    "doc_stack": "c - s",
    "doc_gas": "118/43",
    "doc_description": "Converts a _Cell_ into a _Slice_. Notice that `c` must be either an ordinary cell, or an exotic cell which is automatically _loaded_ to yield an ordinary cell `c'`, converted into a _Slice_ afterwards."
  },
  {
    "name": "ENDS",
    "alias_of": "",
    "tlb": "#D1",
    "doc_category": "cell_parse",
    "doc_opcode": "D1",
    "doc_fift": "ENDS",
    "doc_stack": "s -",
    "doc_gas": "18/68",
    "doc_description": "Removes a _Slice_ `s` from the stack, and throws an exception if it is not empty."
  },
  {
    "name": "LDI",
    "alias_of": "",
    "tlb": "#D2 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D2cc",
    "doc_fift": "[cc+1] LDI",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "doc_description": "Loads (i.e., parses) a signed `cc+1`-bit integer `x` from _Slice_ `s`, and returns the remainder of `s` as `s'`."
  },
  {
    "name": "LDU",
    "alias_of": "",
    "tlb": "#D3 cc:uint8",
    "doc_category": "cell_parse",
    "doc_opcode": "D3cc",
    "doc_fift": "[cc+1] LDU",
    "doc_stack": "s - x s'",
    "doc_gas": 26,
    "do

[Content truncated due to size limit]


================================================
FILE: src/data/opcodes/stack_manipulation.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/stack_manipulation.json
================================================
[
  {
    "name": "NOP",
    "alias_of": "",
    "tlb": "#00",
    "doc_category": "stack_basic",
    "doc_opcode": "00",
    "doc_fift": "NOP",
    "doc_stack": "-",
    "doc_gas": 18,
    "doc_description": "Does nothing."
  },
  {
    "name": "SWAP",
    "alias_of": "XCHG_0I",
    "tlb": "#01",
    "doc_category": "stack_basic",
    "doc_opcode": "01",
    "doc_fift": "SWAP",
    "doc_stack": "x y - y x",
    "doc_gas": 18,
    "doc_description": "Same as `s1 XCHG0`."
  },
  {
    "name": "XCHG_0I",
    "alias_of": "",
    "tlb": "#0 i:(## 4) {1 <= i}",
    "doc_category": "stack_basic",
    "doc_opcode": "0i",
    "doc_fift": "s[i] XCHG0",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Interchanges `s0` with `s[i]`, `1 <= i <= 15`."
  },
  {
    "name": "XCHG_IJ",
    "alias_of": "",
    "tlb": "#10 i:(## 4) j:(## 4) {1 <= i} {i + 1 <= j}",
    "doc_category": "stack_basic",
    "doc_opcode": "10ij",
    "doc_fift": "s[i] s[j] XCHG",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Interchanges `s[i]` with `s[j]`, `1 <= i < j <= 15`."
  },
  {
    "name": "XCHG_0I_LONG",
    "alias_of": "",
    "tlb": "#11 ii:uint8",
    "doc_category": "stack_basic",
    "doc_opcode": "11ii",
    "doc_fift": "s0 [ii] s() XCHG",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Interchanges `s0` with `s[ii]`, `0 <= ii <= 255`."
  },
  {
    "name": "XCHG_1I",
    "alias_of": "",
    "tlb": "#1 i:(## 4) {2 <= i}",
    "doc_category": "stack_basic",
    "doc_opcode": "1i",
    "doc_fift": "s1 s[i] XCHG",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Interchanges `s1` with `s[i]`, `2 <= i <= 15`."
  },
  {
    "name": "PUSH",
    "alias_of": "",
    "tlb": "#2 i:uint4",
    "doc_category": "stack_basic",
    "doc_opcode": "2i",
    "doc_fift": "s[i] PUSH",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pushes a copy of the old `s[i]` into the stack."
  },
  {
    "name": "DUP",
    "alias_of": "PUSH",
    "tlb": "#20",
    "doc_category": "stack_basic",
    "doc_opcode": 20,
    "doc_fift": "DUP",
    "doc_stack": "x - x x",
    "doc_gas": 18,
    "doc_description": "Same as `s0 PUSH`."
  },
  {
    "name": "OVER",
    "alias_of": "PUSH",
    "tlb": "#21",
    "doc_category": "stack_basic",
    "doc_opcode": 21,
    "doc_fift": "OVER",
    "doc_stack": "x y - x y x",
    "doc_gas": 18,
    "doc_description": "Same as `s1 PUSH`."
  },
  {
    "name": "POP",
    "alias_of": "",
    "tlb": "#3 i:uint4",
    "doc_category": "stack_basic",
    "doc_opcode": "3i",
    "doc_fift": "s[i] POP",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops the old `s0` value into the old `s[i]`."
  },
  {
    "name": "DROP",
    "alias_of": "POP",
    "tlb": "#30",
    "doc_category": "stack_basic",
    "doc_opcode": 30,
    "doc_fift": "DROP",
    "doc_stack": "x -",
    "doc_gas": 18,
    "doc_description": "Same as `s0 POP`, discards the top-of-stack value."
  },
  {
    "name": "NIP",
    "alias_of": "POP",
    "tlb": "#31",
    "doc_category": "stack_basic",
    "doc_opcode": 31,
    "doc_fift": "NIP",
    "doc_stack": "x y - y",
    "doc_gas": 18,
    "doc_description": "Same as `s1 POP`."
  },
  {
    "name": "XCHG3",
    "alias_of": "",
    "tlb": "#4 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "4ijk",
    "doc_fift": "s[i] s[j] s[k] XCHG3",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s2 s[i] XCHG` `s1 s[j] XCHG` `s[k] XCHG0`."
  },
  {
    "name": "XCHG2",
    "alias_of": "",
    "tlb": "#50 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "50ij",
    "doc_fift": "s[i] s[j] XCHG2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s1 s[i] XCHG` `s[j] XCHG0`."
  },
  {
    "name": "XCPU",
    "alias_of": "",
    "tlb": "#51 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "51ij",
    "doc_fift": "s[i] s[j] XCPU",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] XCHG0` `s[j] PUSH`."
  },
  {
    "name": "PUXC",
    "alias_of": "",
    "tlb": "#52 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "52ij",
    "doc_fift": "s[i] s[j-1] PUXC",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] PUSH` `SWAP` `s[j] XCHG0`."
  },
  {
    "name": "PUSH2",
    "alias_of": "",
    "tlb": "#53 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "53ij",
    "doc_fift": "s[i] s[j] PUSH2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `s[i] PUSH` `s[j+1] PUSH`."
  },
  {
    "name": "XCHG3_ALT",
    "alias_of": "",
    "tlb": "#540 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "540ijk",
    "doc_fift": "s[i] s[j] s[k] XCHG3_l",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Long form of `XCHG3`."
  },
  {
    "name": "XC2PU",
    "alias_of": "",
    "tlb": "#541 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "541ijk",
    "doc_fift": "s[i] s[j] s[k] XC2PU",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] s[j] XCHG2` `s[k] PUSH`."
  },
  {
    "name": "XCPUXC",
    "alias_of": "",
    "tlb": "#542 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "542ijk",
    "doc_fift": "s[i] s[j] s[k-1] XCPUXC",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s1 s[i] XCHG` `s[j] s[k-1] PUXC`."
  },
  {
    "name": "XCPU2",
    "alias_of": "",
    "tlb": "#543 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "543ijk",
    "doc_fift": "s[i] s[j] s[k] XCPU2",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] XCHG0` `s[j] s[k] PUSH2`."
  },
  {
    "name": "PUXC2",
    "alias_of": "",
    "tlb": "#544 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "544ijk",
    "doc_fift": "s[i] s[j-1] s[k-1] PUXC2",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `s2 XCHG0` `s[j] s[k] XCHG2`."
  },
  {
    "name": "PUXCPU",
    "alias_of": "",
    "tlb": "#545 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "545ijk",
    "doc_fift": "s[i] s[j-1] s[k-1] PUXCPU",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] s[j-1] PUXC` `s[k] PUSH`."
  },
  {
    "name": "PU2XC",
    "alias_of": "",
    "tlb": "#546 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "546ijk",
    "doc_fift": "s[i] s[j-1] s[k-2] PU2XC",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `SWAP` `s[j] s[k-1] PUXC`."
  },
  {
    "name": "PUSH3",
    "alias_of": "",
    "tlb": "#547 i:uint4 j:uint4 k:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "547ijk",
    "doc_fift": "s[i] s[j] s[k] PUSH3",
    "doc_stack": "",
    "doc_gas": 34,
    "doc_description": "Equivalent to `s[i] PUSH` `s[j+1] s[k+1] PUSH2`."
  },
  {
    "name": "BLKSWAP",
    "alias_of": "",
    "tlb": "#55 i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "55ij",
    "doc_fift": "[i+1] [j+1] BLKSWAP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Permutes two blocks `s[j+i+1] … s[j+1]` and `s[j] … s0`.\n`0 <= i,j <= 15`\nEquivalent to `[i+1] [j+1] REVERSE` `[j+1] 0 REVERSE` `[i+j+2] 0 REVERSE`."
  },
  {
    "name": "ROT2",
    "alias_of": "BLKSWAP",
    "tlb": "#5513",
    "doc_category": "stack_complex",
    "doc_opcode": 5513,
    "doc_fift": "ROT2\n2ROT",
    "doc_stack": "a b c d e f - c d e f a b",
    "doc_gas": 26,
    "doc_description": "Rotates the three topmost pairs of stack entries."
  },
  {
    "name": "ROLL",
    "alias_of": "BLKSWAP",
    "tlb": "#550 i:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "550i",
    "doc_fift": "[i+1] ROLL",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Rotates the top `i+1` stack entries.\nEquivalent to `1 [i+1] BLKSWAP`."
  },
  {
    "name": "ROLLREV",
    "alias_of": "BLKSWAP",
    "tlb": "#55 i:uint4 zero:(## 4) {zero = 0}",
    "doc_category": "stack_complex",
    "doc_opcode": "55i0",
    "doc_fift": "[i+1] -ROLL\n[i+1] ROLLREV",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Rotates the top `i+1` stack entries in the other direction.\nEquivalent to `[i+1] 1 BLKSWAP`."
  },
  {
    "name": "PUSH_LONG",
    "alias_of": "",
    "tlb": "#56 ii:uint8",
    "doc_category": "stack_complex",
    "doc_opcode": "56ii",
    "doc_fift": "[ii] s() PUSH",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Pushes a copy of the old `s[ii]` into the stack.\n`0 <= ii <= 255`"
  },
  {
    "name": "POP_LONG",
    "alias_of": "",
    "tlb": "#57 ii:uint8",
    "doc_category": "stack_complex",
    "doc_opcode": "57ii",
    "doc_fift": "[ii] s() POP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Pops the old `s0` value into the old `s[ii]`.\n`0 <= ii <= 255`"
  },
  {
    "name": "ROT",
    "alias_of": "",
    "tlb": "#58",
    "doc_category": "stack_complex",
    "doc_opcode": 58,
    "doc_fift": "ROT",
    "doc_stack": "a b c - b c a",
    "doc_gas": 18,
    "doc_description": "Equivalent to `1 2 BLKSWAP` or to `s2 s1 XCHG2`."
  },
  {
    "name": "ROTREV",
    "alias_of": "",
    "tlb": "#59",
    "doc_category": "stack_complex",
    "doc_opcode": 59,
    "doc_fift": "ROTREV\n-ROT",
    "doc_stack": "a b c - c a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `2 1 BLKSWAP` or to `s2 s2 XCHG2`."
  },
  {
    "name": "SWAP2",
    "alias_of": "",
    "tlb": "#5A",
    "doc_category": "stack_complex",
    "doc_opcode": "5A",
    "doc_fift": "SWAP2\n2SWAP",
    "doc_stack": "a b c d - c d a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `2 2 BLKSWAP` or to `s3 s2 XCHG2`."
  },
  {
    "name": "DROP2",
    "alias_of": "",
    "tlb": "#5B",
    "doc_category": "stack_complex",
    "doc_opcode": "5B",
    "doc_fift": "DROP2\n2DROP",
    "doc_stack": "a b -",
    "doc_gas": 18,
    "doc_description": "Equivalent to `DROP` `DROP`."
  },
  {
    "name": "DUP2",
    "alias_of": "",
    "tlb": "#5C",
    "doc_category": "stack_complex",
    "doc_opcode": "5C",
    "doc_fift": "DUP2\n2DUP",
    "doc_stack": "a b - a b a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `s1 s0 PUSH2`."
  },
  {
    "name": "OVER2",
    "alias_of": "",
    "tlb": "#5D",
    "doc_category": "stack_complex",
    "doc_opcode": "5D",
    "doc_fift": "OVER2\n2OVER",
    "doc_stack": "a b c d - a b c d a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `s3 s2 PUSH2`."
  },
  {
    "name": "REVERSE",
    "alias_of": "",
    "tlb": "#5E i:uint4 j:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "5Eij",
    "doc_fift": "[i+2] [j] REVERSE",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Reverses the order of `s[j+i+1] … s[j]`."
  },
  {
    "name": "BLKDROP",
    "alias_of": "",
    "tlb": "#5F0 i:uint4",
    "doc_category": "stack_complex",
    "doc_opcode": "5F0i",
    "doc_fift": "[i] BLKDROP",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `DROP` performed `i` times."
  },
  {
    "name": "BLKPUSH",
    "alias_of": "",
    "tlb": "#5F i:(## 4) j:uint4 {1 <= i}",
    "doc_category": "stack_complex",
    "doc_opcode": "5Fij",
    "doc_fift": "[i] [j] BLKPUSH",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Equivalent to `PUSH s(j)` performed `i` times.\n`1 <= i <= 15`, `0 <= j <= 15`."
  },
  {
    "name": "PICK",
    "alias_of": "",
    "tlb": "#60",
    "doc_category": "stack_complex",
    "doc_opcode": 60,
    "doc_fift": "PICK\nPUSHX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `s[i] PUSH`."
  },
  {
    "name": "ROLLX",
    "alias_of": "",
    "tlb": "#61",
    "doc_category": "stack_complex",
    "doc_opcode": 61,
    "doc_fift": "ROLLX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `1 [i] BLKSWAP`."
  },
  {
    "name": "-ROLLX",
    "alias_of": "",
    "tlb": "#62",
    "doc_category": "stack_complex",
    "doc_opcode": 62,
    "doc_fift": "-ROLLX\nROLLREVX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `[i] 1 BLKSWAP`."
  },
  {
    "name": "BLKSWX",
    "alias_of": "",
    "tlb": "#63",
    "doc_category": "stack_complex",
    "doc_opcode": 63,
    "doc_fift": "BLKSWX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integers `i`,`j` from the stack, then performs `[i] [j] BLKSWAP`."
  },
  {
    "name": "REVX",
    "alias_of": "",
    "tlb": "#64",
    "doc_category": "stack_complex",
    "doc_opcode": 64,
    "doc_fift": "REVX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integers `i`,`j` from the stack, then performs `[i] [j] REVERSE`."
  },
  {
    "name": "DROPX",
    "alias_of": "",
    "tlb": "#65",
    "doc_category": "stack_complex",
    "doc_opcode": 65,
    "doc_fift": "DROPX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `[i] BLKDROP`."
  },
  {
    "name": "TUCK",
    "alias_of": "",
    "tlb": "#66",
    "doc_category": "stack_complex",
    "doc_opcode": 66,
    "doc_fift": "TUCK",
    "doc_stack": "a b - b a b",
    "doc_gas": 18,
    "doc_description": "Equivalent to `SWAP` `OVER` or to `s1 s1 XCPU`."
  },
  {
    "name": "XCHGX",
    "alias_of": "",
    "tlb": "#67",
    "doc_category": "stack_complex",
    "doc_opcode": 67,
    "doc_fift": "XCHGX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then performs `s[i] XCHG`."
  },
  {
    "name": "DEPTH",
    "alias_of": "",
    "tlb": "#68",
    "doc_category": "stack_complex",
    "doc_opcode": 68,
    "doc_fift": "DEPTH",
    "doc_stack": "- depth",
    "doc_gas": 18,
    "doc_description": "Pushes the current depth of the stack."
  },
  {
    "name": "CHKDEPTH",
    "alias_of": "",
    "tlb": "#69",
    "doc_category": "stack_complex",
    "doc_opcode": 69,
    "doc_fift": "CHKDEPTH",
    "doc_stack": "i -",
    "doc_gas": "18/58",
    "doc_description": "Pops integer `i` from the stack, then checks whether there are at least `i` elements, generating a stack underflow exception otherwise."
  },
  {
    "name": "ONLYTOPX",
    "alias_of": "",
    "tlb": "#6A",
    "doc_category": "stack_complex",
    "doc_opcode": "6A",
    "doc_fift": "ONLYTOPX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then removes all but the top `i` elements."
  },
  {
    "name": "ONLYX",
    "alias_of": "",
    "tlb": "#6B",
    "doc_category": "stack_complex",
    "doc_opcode": "6B",
    "doc_fift": "ONLYX",
    "doc_stack": "",
    "doc_gas": 18,
    "doc_description": "Pops integer `i` from the stack, then leaves only the bottom `i` elements. Approximately equivalent to `DEPTH` `SWAP` `SUB` `DROPX`."
  },
  {
    "name": "BLKDROP2",
    "alias_of": "",
    "tlb": "#6C i:(## 4) j:uint4 {1 <= i}",
    "doc_category": "stack_complex",
    "doc_opcode": "6Cij",
    "doc_fift": "[i] [j] BLKDROP2",
    "doc_stack": "",
    "doc_gas": 26,
    "doc_description": "Drops `i` stack elements under the top `j` elements.\n`1 <= i <= 15`, `0 <= j <= 15`\nEquivalent to `[i+j] 0 REVERSE` `[i] BLKDROP` `[j] 0 REVERSE`."
  }
]



================================================
FILE: src/data/opcodes/tuple.json
URL: https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes/tuple.json
================================================
[
  {
    "name": "NULL",
    "alias_of": "",
    "tlb": "#6D",
    "doc_category": "tuple",
    "doc_opcode": "6D",
    "doc_fift": "NULL\nPUSHNULL",
    "doc_stack": "- null",
    "doc_gas": 18,
    "doc_description": "Pushes the only value of type _Null_."
  },
  {
    "name": "ISNULL",
    "alias_of": "",
    "tlb": "#6E",
    "doc_category": "tuple",
    "doc_opcode": "6E",
    "doc_fift": "ISNULL",
    "doc_stack": "x - ?",
    "doc_gas": 18,
    "doc_description": "Checks whether `x` is a _Null_, and returns `-1` or `0` accordingly."
  },
  {
    "name": "TUPLE",
    "alias_of": "",
    "tlb": "#6F0 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F0n",
    "doc_fift": "[n] TUPLE",
    "doc_stack": "x_1 ... x_n - t",
    "doc_gas": "26+n",
    "doc_description": "Creates a new _Tuple_ `t=(x_1, … ,x_n)` containing `n` values `x_1`,..., `x_n`.\n`0 <= n <= 15`"
  },
  {
    "name": "NIL",
    "alias_of": "TUPLE",
    "tlb": "#6F00",
    "doc_category": "tuple",
    "doc_opcode": "6F00",
    "doc_fift": "NIL",
    "doc_stack": "- t",
    "doc_gas": 26,
    "doc_description": "Pushes the only _Tuple_ `t=()` of length zero."
  },
  {
    "name": "SINGLE",
    "alias_of": "TUPLE",
    "tlb": "#6F01",
    "doc_category": "tuple",
    "doc_opcode": "6F01",
    "doc_fift": "SINGLE",
    "doc_stack": "x - t",
    "doc_gas": 27,
    "doc_description": "Creates a singleton `t:=(x)`, i.e., a _Tuple_ of length one."
  },
  {
    "name": "PAIR",
    "alias_of": "TUPLE",
    "tlb": "#6F02",
    "doc_category": "tuple",
    "doc_opcode": "6F02",
    "doc_fift": "PAIR\nCONS",
    "doc_stack": "x y - t",
    "doc_gas": 28,
    "doc_description": "Creates pair `t:=(x,y)`."
  },
  {
    "name": "TRIPLE",
    "alias_of": "TUPLE",
    "tlb": "#6F03",
    "doc_category": "tuple",
    "doc_opcode": "6F03",
    "doc_fift": "TRIPLE",
    "doc_stack": "x y z - t",
    "doc_gas": 29,
    "doc_description": "Creates triple `t:=(x,y,z)`."
  },
  {
    "name": "INDEX",
    "alias_of": "",
    "tlb": "#6F1 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F1k",
    "doc_fift": "[k] INDEX",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th element of a _Tuple_ `t`.\n`0 <= k <= 15`."
  },
  {
    "name": "FIRST",
    "alias_of": "INDEX",
    "tlb": "#6F10",
    "doc_category": "tuple",
    "doc_opcode": "6F10",
    "doc_fift": "FIRST\nCAR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the first element of a _Tuple_."
  },
  {
    "name": "SECOND",
    "alias_of": "INDEX",
    "tlb": "#6F11",
    "doc_category": "tuple",
    "doc_opcode": "6F11",
    "doc_fift": "SECOND\nCDR",
    "doc_stack": "t - y",
    "doc_gas": 26,
    "doc_description": "Returns the second element of a _Tuple_."
  },
  {
    "name": "THIRD",
    "alias_of": "INDEX",
    "tlb": "#6F12",
    "doc_category": "tuple",
    "doc_opcode": "6F12",
    "doc_fift": "THIRD",
    "doc_stack": "t - z",
    "doc_gas": 26,
    "doc_description": "Returns the third element of a _Tuple_."
  },
  {
    "name": "UNTUPLE",
    "alias_of": "",
    "tlb": "#6F2 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F2n",
    "doc_fift": "[n] UNTUPLE",
    "doc_stack": "t - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Unpacks a _Tuple_ `t=(x_1,...,x_n)` of length equal to `0 <= n <= 15`.\nIf `t` is not a _Tuple_, or if `|t| != n`, a type check exception is thrown."
  },
  {
    "name": "UNSINGLE",
    "alias_of": "UNTUPLE",
    "tlb": "#6F21",
    "doc_category": "tuple",
    "doc_opcode": "6F21",
    "doc_fift": "UNSINGLE",
    "doc_stack": "t - x",
    "doc_gas": 27,
    "doc_description": "Unpacks a singleton `t=(x)`."
  },
  {
    "name": "UNPAIR",
    "alias_of": "UNTUPLE",
    "tlb": "#6F22",
    "doc_category": "tuple",
    "doc_opcode": "6F22",
    "doc_fift": "UNPAIR\nUNCONS",
    "doc_stack": "t - x y",
    "doc_gas": 28,
    "doc_description": "Unpacks a pair `t=(x,y)`."
  },
  {
    "name": "UNTRIPLE",
    "alias_of": "UNTUPLE",
    "tlb": "#6F23",
    "doc_category": "tuple",
    "doc_opcode": "6F23",
    "doc_fift": "UNTRIPLE",
    "doc_stack": "t - x y z",
    "doc_gas": 29,
    "doc_description": "Unpacks a triple `t=(x,y,z)`."
  },
  {
    "name": "UNPACKFIRST",
    "alias_of": "",
    "tlb": "#6F3 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F3k",
    "doc_fift": "[k] UNPACKFIRST",
    "doc_stack": "t - x_1 ... x_k",
    "doc_gas": "26+k",
    "doc_description": "Unpacks first `0 <= k <= 15` elements of a _Tuple_ `t`.\nIf `|t|<k`, throws a type check exception."
  },
  {
    "name": "CHKTUPLE",
    "alias_of": "UNPACKFIRST",
    "tlb": "#6F30",
    "doc_category": "tuple",
    "doc_opcode": "6F30",
    "doc_fift": "CHKTUPLE",
    "doc_stack": "t -",
    "doc_gas": 26,
    "doc_description": "Checks whether `t` is a _Tuple_. If not, throws a type check exception."
  },
  {
    "name": "EXPLODE",
    "alias_of": "",
    "tlb": "#6F4 n:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F4n",
    "doc_fift": "[n] EXPLODE",
    "doc_stack": "t - x_1 ... x_m m",
    "doc_gas": "26+m",
    "doc_description": "Unpacks a _Tuple_ `t=(x_1,...,x_m)` and returns its length `m`, but only if `m <= n <= 15`. Otherwise throws a type check exception."
  },
  {
    "name": "SETINDEX",
    "alias_of": "",
    "tlb": "#6F5 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F5k",
    "doc_fift": "[k] SETINDEX",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Computes _Tuple_ `t'` that differs from `t` only at position `t'_{k+1}`, which is set to `x`.\n`0 <= k <= 15`\nIf `k >= |t|`, throws a range check exception."
  },
  {
    "name": "SETFIRST",
    "alias_of": "SETINDEX",
    "tlb": "#6F50",
    "doc_category": "tuple",
    "doc_opcode": "6F50",
    "doc_fift": "SETFIRST",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the first component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETSECOND",
    "alias_of": "SETINDEX",
    "tlb": "#6F51",
    "doc_category": "tuple",
    "doc_opcode": "6F51",
    "doc_fift": "SETSECOND",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the second component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETTHIRD",
    "alias_of": "SETINDEX",
    "tlb": "#6F52",
    "doc_category": "tuple",
    "doc_opcode": "6F52",
    "doc_fift": "SETTHIRD",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t|",
    "doc_description": "Sets the third component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "INDEXQ",
    "alias_of": "",
    "tlb": "#6F6 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F6k",
    "doc_fift": "[k] INDEXQ",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the `k`-th element of a _Tuple_ `t`, where `0 <= k <= 15`. In other words, returns `x_{k+1}` if `t=(x_1,...,x_n)`. If `k>=n`, or if `t` is _Null_, returns a _Null_ instead of `x`."
  },
  {
    "name": "FIRSTQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F60",
    "doc_category": "tuple",
    "doc_opcode": "6F60",
    "doc_fift": "FIRSTQ\nCARQ",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the first element of a _Tuple_."
  },
  {
    "name": "SECONDQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F61",
    "doc_category": "tuple",
    "doc_opcode": "6F61",
    "doc_fift": "SECONDQ\nCDRQ",
    "doc_stack": "t - y",
    "doc_gas": 26,
    "doc_description": "Returns the second element of a _Tuple_."
  },
  {
    "name": "THIRDQ",
    "alias_of": "INDEXQ",
    "tlb": "#6F62",
    "doc_category": "tuple",
    "doc_opcode": "6F62",
    "doc_fift": "THIRDQ",
    "doc_stack": "t - z",
    "doc_gas": 26,
    "doc_description": "Returns the third element of a _Tuple_."
  },
  {
    "name": "SETINDEXQ",
    "alias_of": "",
    "tlb": "#6F7 k:uint4",
    "doc_category": "tuple",
    "doc_opcode": "6F7k",
    "doc_fift": "[k] SETINDEXQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the `k`-th component of _Tuple_ `t` to `x`, where `0 <= k < 16`, and returns the resulting _Tuple_ `t'`.\nIf `|t| <= k`, first extends the original _Tuple_ to length `n’=k+1` by setting all new components to _Null_. If the original value of `t` is _Null_, treats it as an empty _Tuple_. If `t` is not _Null_ or _Tuple_, throws an exception. If `x` is _Null_ and either `|t| <= k` or `t` is _Null_, then always returns `t'=t` (and does not consume tuple creation gas)."
  },
  {
    "name": "SETFIRSTQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F70",
    "doc_category": "tuple",
    "doc_opcode": "6F70",
    "doc_fift": "SETFIRSTQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the first component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETSECONDQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F71",
    "doc_category": "tuple",
    "doc_opcode": "6F71",
    "doc_fift": "SETSECONDQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the second component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "SETTHIRDQ",
    "alias_of": "SETINDEXQ",
    "tlb": "#6F72",
    "doc_category": "tuple",
    "doc_opcode": "6F72",
    "doc_fift": "SETTHIRDQ",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Sets the third component of _Tuple_ `t` to `x` and returns the resulting _Tuple_ `t'`."
  },
  {
    "name": "TUPLEVAR",
    "alias_of": "",
    "tlb": "#6F80",
    "doc_category": "tuple",
    "doc_opcode": "6F80",
    "doc_fift": "TUPLEVAR",
    "doc_stack": "x_1 ... x_n n - t",
    "doc_gas": "26+n",
    "doc_description": "Creates a new _Tuple_ `t` of length `n` similarly to `TUPLE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "INDEXVAR",
    "alias_of": "",
    "tlb": "#6F81",
    "doc_category": "tuple",
    "doc_opcode": "6F81",
    "doc_fift": "INDEXVAR",
    "doc_stack": "t k - x",
    "doc_gas": 26,
    "doc_description": "Similar to `k INDEX`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "UNTUPLEVAR",
    "alias_of": "",
    "tlb": "#6F82",
    "doc_category": "tuple",
    "doc_opcode": "6F82",
    "doc_fift": "UNTUPLEVAR",
    "doc_stack": "t n - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Similar to `n UNTUPLE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "UNPACKFIRSTVAR",
    "alias_of": "",
    "tlb": "#6F83",
    "doc_category": "tuple",
    "doc_opcode": "6F83",
    "doc_fift": "UNPACKFIRSTVAR",
    "doc_stack": "t n - x_1 ... x_n",
    "doc_gas": "26+n",
    "doc_description": "Similar to `n UNPACKFIRST`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "EXPLODEVAR",
    "alias_of": "",
    "tlb": "#6F84",
    "doc_category": "tuple",
    "doc_opcode": "6F84",
    "doc_fift": "EXPLODEVAR",
    "doc_stack": "t n - x_1 ... x_m m",
    "doc_gas": "26+m",
    "doc_description": "Similar to `n EXPLODE`, but with `0 <= n <= 255` taken from the stack."
  },
  {
    "name": "SETINDEXVAR",
    "alias_of": "",
    "tlb": "#6F85",
    "doc_category": "tuple",
    "doc_opcode": "6F85",
    "doc_fift": "SETINDEXVAR",
    "doc_stack": "t x k - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Similar to `k SETINDEX`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "INDEXVARQ",
    "alias_of": "",
    "tlb": "#6F86",
    "doc_category": "tuple",
    "doc_opcode": "6F86",
    "doc_fift": "INDEXVARQ",
    "doc_stack": "t k - x",
    "doc_gas": 26,
    "doc_description": "Similar to `n INDEXQ`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "SETINDEXVARQ",
    "alias_of": "",
    "tlb": "#6F87",
    "doc_category": "tuple",
    "doc_opcode": "6F87",
    "doc_fift": "SETINDEXVARQ",
    "doc_stack": "t x k - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Similar to `k SETINDEXQ`, but with `0 <= k <= 254` taken from the stack."
  },
  {
    "name": "TLEN",
    "alias_of": "",
    "tlb": "#6F88",
    "doc_category": "tuple",
    "doc_opcode": "6F88",
    "doc_fift": "TLEN",
    "doc_stack": "t - n",
    "doc_gas": 26,
    "doc_description": "Returns the length of a _Tuple_."
  },
  {
    "name": "QTLEN",
    "alias_of": "",
    "tlb": "#6F89",
    "doc_category": "tuple",
    "doc_opcode": "6F89",
    "doc_fift": "QTLEN",
    "doc_stack": "t - n or -1",
    "doc_gas": 26,
    "doc_description": "Similar to `TLEN`, but returns `-1` if `t` is not a _Tuple_."
  },
  {
    "name": "ISTUPLE",
    "alias_of": "",
    "tlb": "#6F8A",
    "doc_category": "tuple",
    "doc_opcode": "6F8A",
    "doc_fift": "ISTUPLE",
    "doc_stack": "t - ?",
    "doc_gas": 26,
    "doc_description": "Returns `-1` or `0` depending on whether `t` is a _Tuple_."
  },
  {
    "name": "LAST",
    "alias_of": "",
    "tlb": "#6F8B",
    "doc_category": "tuple",
    "doc_opcode": "6F8B",
    "doc_fift": "LAST",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Returns the last element of a non-empty _Tuple_ `t`."
  },
  {
    "name": "TPUSH",
    "alias_of": "",
    "tlb": "#6F8C",
    "doc_category": "tuple",
    "doc_opcode": "6F8C",
    "doc_fift": "TPUSH\nCOMMA",
    "doc_stack": "t x - t'",
    "doc_gas": "26+|t’|",
    "doc_description": "Appends a value `x` to a _Tuple_ `t=(x_1,...,x_n)`, but only if the resulting _Tuple_ `t'=(x_1,...,x_n,x)` is of length at most 255. Otherwise throws a type check exception."
  },
  {
    "name": "TPOP",
    "alias_of": "",
    "tlb": "#6F8D",
    "doc_category": "tuple",
    "doc_opcode": "6F8D",
    "doc_fift": "TPOP",
    "doc_stack": "t - t' x",
    "doc_gas": "26+|t’|",
    "doc_description": "Detaches the last element `x=x_n` from a non-empty _Tuple_ `t=(x_1,...,x_n)`, and returns both the resulting _Tuple_ `t'=(x_1,...,x_{n-1})` and the original last element `x`."
  },
  {
    "name": "NULLSWAPIF",
    "alias_of": "",
    "tlb": "#6FA0",
    "doc_category": "tuple",
    "doc_opcode": "6FA0",
    "doc_fift": "NULLSWAPIF",
    "doc_stack": "x - x or null x",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the topmost _Integer_ `x`, but only if `x!=0`."
  },
  {
    "name": "NULLSWAPIFNOT",
    "alias_of": "",
    "tlb": "#6FA1",
    "doc_category": "tuple",
    "doc_opcode": "6FA1",
    "doc_fift": "NULLSWAPIFNOT",
    "doc_stack": "x - x or null x",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the topmost _Integer_ `x`, but only if `x=0`. May be used for stack alignment after quiet primitives such as `PLDUXQ`."
  },
  {
    "name": "NULLROTRIF",
    "alias_of": "",
    "tlb": "#6FA2",
    "doc_category": "tuple",
    "doc_opcode": "6FA2",
    "doc_fift": "NULLROTRIF",
    "doc_stack": "x y - x y or null x y",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the second stack entry from the top, but only if the topmost _Integer_ `y` is non-zero."
  },
  {
    "name": "NULLROTRIFNOT",
    "alias_of": "",
    "tlb": "#6FA3",
    "doc_category": "tuple",
    "doc_opcode": "6FA3",
    "doc_fift": "NULLROTRIFNOT",
    "doc_stack": "x y - x y or null x y",
    "doc_gas": 26,
    "doc_description": "Pushes a _Null_ under the second stack entry from the top, but only if the topmost _Integer_ `y` is zero. May be used for stack alignment after quiet primitives such as `LDUXQ`."
  },
  {
    "name": "NULLSWAPIF2",
    "alias_of": "",
    "tlb": "#6FA4",
    "doc_category": "tuple",
    "doc_opcode": "6FA4",
    "doc_fift": "NULLSWAPIF2",
    "doc_stack": "x - x or null null x",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the topmost _Integer_ `x`, but only if `x!=0`.\nEquivalent to `NULLSWAPIF` `NULLSWAPIF`."
  },
  {
    "name": "NULLSWAPIFNOT2",
    "alias_of": "",
    "tlb": "#6FA5",
    "doc_category": "tuple",
    "doc_opcode": "6FA5",
    "doc_fift": "NULLSWAPIFNOT2",
    "doc_stack": "x - x or null null x",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the topmost _Integer_ `x`, but only if `x=0`.\nEquivalent to `NULLSWAPIFNOT` `NULLSWAPIFNOT`."
  },
  {
    "name": "NULLROTRIF2",
    "alias_of": "",
    "tlb": "#6FA6",
    "doc_category": "tuple",
    "doc_opcode": "6FA6",
    "doc_fift": "NULLROTRIF2",
    "doc_stack": "x y - x y or null null x y",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the second stack entry from the top, but only if the topmost _Integer_ `y` is non-zero.\nEquivalent to `NULLROTRIF` `NULLROTRIF`."
  },
  {
    "name": "NULLROTRIFNOT2",
    "alias_of": "",
    "tlb": "#6FA7",
    "doc_category": "tuple",
    "doc_opcode": "6FA7",
    "doc_fift": "NULLROTRIFNOT2",
    "doc_stack": "x y - x y or null null x y",
    "doc_gas": 26,
    "doc_description": "Pushes two nulls under the second stack entry from the top, but only if the topmost _Integer_ `y` is zero.\nEquivalent to `NULLROTRIFNOT` `NULLROTRIFNOT`."
  },
  {
    "name": "INDEX2",
    "alias_of": "",
    "tlb": "#6FB i:uint2 j:uint2",
    "doc_category": "tuple",
    "doc_opcode": "6FBij",
    "doc_fift": "[i] [j] INDEX2",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_{i+1})_{j+1}` for `0 <= i,j <= 3`.\nEquivalent to `[i] INDEX` `[j] INDEX`."
  },
  {
    "name": "CADR",
    "alias_of": "INDEX2",
    "tlb": "#6FB4",
    "doc_category": "tuple",
    "doc_opcode": "6FB4",
    "doc_fift": "CADR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_2)_1`."
  },
  {
    "name": "CDDR",
    "alias_of": "INDEX2",
    "tlb": "#6FB5",
    "doc_category": "tuple",
    "doc_opcode": "6FB5",
    "doc_fift": "CDDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=(t_2)_2`."
  },
  {
    "name": "INDEX3",
    "alias_of": "",
    "tlb": "#6FE_ i:uint2 j:uint2 k:uint2",
    "doc_category": "tuple",
    "doc_opcode": "6FE_ijk",
    "doc_fift": "[i] [j] [k] INDEX3",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_{i+1}_{j+1}_{k+1}`.\n`0 <= i,j,k <= 3`\nEquivalent to `[i] [j] INDEX2` `[k] INDEX`."
  },
  {
    "name": "CADDR",
    "alias_of": "INDEX3",
    "tlb": "#6FD4",
    "doc_category": "tuple",
    "doc_opcode": "6FD4",
    "doc_fift": "CADDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_2_2_1`."
  },
  {
    "name": "CDDDR",
    "alias_of": "INDEX3",
    "tlb": "#6FD5",
    "doc_category": "tuple",
    "doc_opcode": "6FD5",
    "doc_fift": "CDDDR",
    "doc_stack": "t - x",
    "doc_gas": 26,
    "doc_description": "Recovers `x=t_2_2_2`."
  }
]



================================================
FILE: src/grammar/commands-dictionary.txt
URL: https://github.com/ton-community/ton-docs/blob/main/src/grammar/commands-dictionary.txt
================================================
clcf
tulpn
drvcf
setwebpass
IGNORE_MINIMAL_REQS
containerd.io
docker-buildx-plugin
newbot
mybots
mysite
mywallet
cskip
stdlib
utime
getconfig
plzip
strdump
delcustomoverlay
showcustomoverlays
sendfile
getWallets
findValue
Lamport


================================================
FILE: src/grammar/examples-dictionary.txt
URL: https://github.com/ton-community/ton-docs/blob/main/src/grammar/examples-dictionary.txt
================================================
validname
alsovalidname
xefefefhahaha


================================================
FILE: src/grammar/names-dictionary.txt
URL: https://github.com/ton-community/ton-docs/blob/main/src/grammar/names-dictionary.txt
================================================
Durov
akifoq
romanovichim
thedailyton
thedaily
Pavel's
Pavel
Slava
Vadim
Volkov
Diffie-Hellman
Schnorr
Golev
Gusarich
xssnick
psylopunk
yungwine
Playmuse
Ristretto
Eruda
Ratelance
Onda
Avacoin
Serokell
townsquarelabs
Codespaces
Codespace
codespace
Gigadrop


================================================
FILE: src/grammar/tvm-dictionary.txt
URL: https://github.com/ton-community/ton-docs/blob/main/src/grammar/tvm-dictionary.txt
================================================

CONDSELCHK
LSHIFTADDDIVMODC_VAR
HASHEXTA_SHA256
DEBUGSTR
PFXDICTGETJMP
QMULDIVMOD
DICTUSET
QMODPOW2C
PUSHCTRX
POPROOT
IFREFELSE
NOP
QMULMODPOW2_VAR
SGN
QNOT
LDSLICE
SDCNTLEAD0
SETCONTCTR
POPSAVE
DICTREPLACEGET
SCHKBITREFS
ISNULL
CLEVEL
ISNNEG
GLOBALID
HASHEXTAR_KECCAK512
REPEATEND
NULLSWAPIF
STZEROES
IFELSEREF
ATEXITALT
SSKIPLAST
DICTGETPREVEQ
SDATASIZEQ
DICTIMAX
DEBUG
SDCUTLAST
DICTUGETEXECZ
BLS_G1_ADD
STREF_ALT
STBREFR_ALT
PLDULE8Q
LDILE4
UNTIL
DICTADDREF
LSHIFTDIVR
ZERO
XCHGX
DICTISETB
STUXR
IFNBITJMPREF
PFXDICTDEL
GETPARAM
POW2
LDMSGADDR
MULRSHIFTCMOD
BCHKBITREFSQ
QLSHIFTDIVR
RIST255_MUL
QLSHIFTMODC_VAR
DICTSET
STUXRQ
QLSHIFTADDDIVMODC_VAR
AGAIN
STI
SPLITQ
TUPLEVAR
QRSHIFTMOD
QAND
GETSTORAGEFEE
DICTUREMMIN
HASHEXTAR_KECCAK256
IFNOTJMP
QUFITS
STZERO
DICTUGET
MULRSHIFTR
LDUXQ
CDEPTHI
DUEPAYMENT
PLDILE4
DICTIREMMIN
QLSHIFTMOD
NULLSWAPIF2
SETGLOBVAR
PLDREFIDX
CALLXVARARGS
PUSHINT_4
STSAME
RETURNVARARGS
HASHEXTAR_SHA512
LDULE8
TRYARGS
FIRSTQ
DIV_BASE
SAVEBOTH
PREPAREDICT
MULRSHIFTC_VAR
DROPX
DUP2
LSHIFTDIV
BLS_G1_ZERO
MULDIVC
COMPOSBOTH
QMODPOW2
DICTIADDGETREF
SWAP2
CHKBIT
QMULADDRSHIFTRMOD
GTINT
DICTIGETPREV
LDREFRTOS
SUBDICTIRPGET
OR
RSHIFTMOD
SCUTFIRST
DICTUMINREF
QMODPOW2R_VAR
DICTUGETJMPZ
RUNVM
SUBDICTRPGET
LSHIFTADDDIVMODC
LSHIFTDIVR_VAR
XOR
SREMPTY
LDILE8
DICTISETGETB
SETRAND
RETVARARGS
MULDIVMODC
QLSHIFTADDDIVMOD
POPCTRX
LDZEROES
CALLREF
BLS_G2_MUL
SDSFXREV
STSLICER
MULDIVR
REPEAT
PLDILE4Q
QMULRSHIFT_VAR
ADDDIVMOD
POP
PUSHREF
NEGATE
EXECUTE
IFJMPREF
STIRQ
DICTUREMMAX
UNTILBRK
MULRSHIFT
STREF2CONST
XCHG_0I
LDGRAMS
SWAP
LESS
STILE4
DICTUGETOPTREF
PLDUQ
LDMSGADDRQ
THROWIF
STORAGEFEES
SDPSFX
STREFRQ
ENDS
DUMP
NULLROTRIFNOT
NULLSWAPIFNOT
DIV
PUSHSLICE_REFS
MULMODPOW2
SETFIRST
XCHG_IJ
GETGLOBVAR
DUMPSTK
XCPU2
BLOCKLT
QMULMODPOW2R_VAR
LSHIFTMODR_VAR
INDEX3
GREATER
SREFS
HASHEXTR_BLAKE2B
CALLXARGS
IFNOTJMPREF
DICTIREMMINREF
SDATASIZE
BLKDROP2
LSHIFTADDDIVMODR_VAR
LSHIFTDIVMOD
DICTUSETGETB
ACCEPT
QMODPOW2R
MINMAX
QLSHIFTDIV_VAR
STUR
PFXDICTADD
DICTGETPREV
DICTREMMIN
PFXDICTGETQ
MULADDDIVMODC
DEPTH
QMODC
DICTUADD
PUSHREFSLICE
DICTUREMMINREF
RIST255_PUSHL
REWRITESTDADDRQ
DICTMAX
MODC
THROWARGANYIFNOT
DICTADDB
SDPFXREV
AGAINENDBRK
INDEXVAR
PUSHSLICE
SAVEALT
DICTUREPLACEGETREF
SDPPFX
DICTUMAX
SDFIRST
DICTADD
BOOLEVAL
QLSHIFTDIVC
PLDI
MULRSHIFTR_VAR
DICTSETREF
DICTMIN
STREFCONST
LDREF
UFITSX
SSKIPFIRST
CALLCCARGS
DICTUADDGET
DICTUMIN
BLS_G1_ISZERO
XCPU
MULMODPOW2R
ATEXIT
MULADDRSHIFTRMOD
IFRET
SECONDQ
DICTIGETJMPZ
DICTREPLACEB
SDCNTTRAIL1
LSHIFTADDDIVMODR
PLDDICTS
BLESSNUMARGS
BLKPUSH
GASCONSUMED
MULMODPOW2C_VAR
CDATASIZE
QMULMODR
PUSHNEGPOW2
QRSHIFTC
QDIVMODR
PREVBLOCKSINFOTUPLE
DICTUGETPREVEQ
HASHEXT_KECCAK512
CMP
DIVC
NULLSWAPIFNOT2
LDULE4Q
QLSHIFT
EQINT
THROWARGANYIF
LDDICTS
QLSHIFTADDDIVMODC
CONFIGROOT
SETEXITALT
QLSHIFTADDDIVMODR
RIST255_QMUL
DICTIGETREF
HASHEXTA_SHA512
ADDRSHIFTMODR
STUQ
IFREF
XCHG3_ALT
LSHIFTDIVMODC_VAR
LSHIFTDIVC
DICTSETGETREF
PREVKEYBLOCK
GETFORWARDFEE
PFXDICTGET
SDBEGINSXQ
RSHIFTMODR_VAR
QRSHIFTCMOD
LSHIFTMOD
DICTSETGETB
MIN
CONFIGDICT
PUSHINT_LONG
INVERT
RSHIFT
REVERSE
NIP
XC2PU
ENDXC
RETDATA
QDIVMOD
MULADDDIVMOD
QADDRSHIFTMODC
RETURNARGS
SDPSFXREV
BCHKREFSQ
PLDDICT
BLS_G2_ADD
STILE8
ISNPOS
MODPOW2_VAR
LSHIFTDIVMODR_VAR
BLS_G1_SUB
GETFORWARDFEESIMPLE
LDU
PUSHCONT_SHORT
QMULRSHIFTMOD
FIRST
THROW
ADDRSHIFTMOD
HASHEXTA_KECCAK512
CHKBOOL
DIVMOD
BLS_FASTAGGREGATEVERIFY
STVARINT16
MULCONST
QMULMODPOW2C
SDEQ
STBQ
XCTOS
PLDDICTQ
DICTGETNEXTEQ
QMULMOD
EQUAL
THIRD
EXPLODEVAR
PLDILE8
DICTIDELGETREF
IFBITJMP
UNTILEND
QMULMODPOW2R
THROWIFNOT_SHORT
MODR
QMULDIV
BLESS
SECOND
MULADDRSHIFTMOD
HASHEXTR_KECCAK256
DICTUGETREF
SETSECONDQ
DICTIGETJMP
PUSH
DICTADDGETREF
QMULDIVMODC
BBITS
CALLCC
GETGASFEE
STGRAMS
HASHEXTR_SHA512
ONLYX
THROWANYIFNOT
DICTUSETB
ISNEG
UNPACKFIRSTVAR
PAIR
QDEC
QMULDIVC
RIST255_QMULBASE
QLSHIFTDIVMODR_VAR
TRUE
QADDDIVMODR
CADR
WHILEBRK
QRSHIFT_VAR
PFXDICTGETEXEC
ENDC
RANDU256
THROWANY
PUSH2
JMPXDATA
MULDIVMODR
DICTGETREF
DIVMODC
LSHIFTDIVMODC
LSHIFT_VAR
QMULRSHIFTRMOD_VAR
SHA256U
QMUL
SETINDEXQ
QADDDIVMODC
IFJMP
BLS_G2_ZERO
QLSHIFT_VAR
QRSHIFTMOD_VAR
THROW_SHORT
SETINDEX
UFITS
DICTIGETEXECZ
QFITSX
NULL
MULDIV
RAND
QTLEN
GETGASFEESIMPLE
XCHG3
QLSHIFTADDDIVMOD_VAR
INDEX2
QMULRSHIFTRMOD
SETSECOND
STREFR
UNTUPLEVAR
DROP
XCHG_0I_LONG
COMPOS
DICTUGETPREV
PFXDICTSET
QSUBR
SDEPTH
STIXRQ
QMULRSHIFT
STSLICEQ
COMMIT
SUB
QADDDIVMOD
QADDRSHIFTMOD
DICTIMAXREF
QLSHIFTMOD_VAR
QMULMODPOW2
RAWRESERVEX
PU2XC
MULADDDIVMODR
PICK
LTIME
QRSHIFTRMOD
HASHEXTR_SHA256
STSLICE_ALT
DICTISET
MYCODE
NULLROTRIF2
SETCP
QLSHIFTDIVC_VAR
QMULMODPOW2C_VAR
IFNBITJMP
REPEATENDBRK
REPEATBRK
UNTUPLE
DICTMAXREF
ADDDIVMODR
UBITSIZE
SETINDEXVARQ
PLDUX
DICTUMAXREF
RSHIFTR
BITSIZE
DICTGETOPTREF
DICTIGETPREVEQ
QLSHIFTMODC
REWRITEVARADDR
CDEPTHIX
STONE
CHKDEPTH
BLKSWX
INDEX
QRSHIFTR
BLS_G1_MULTIEXP
HASHCU
DICTIREPLACE
THROWARGIFNOT
SEMPTY
DICTSETGET
NEQ
DICTUGETNEXTEQ
DICTUADDB
QLSHIFTDIVMODC
BRANCH
LDI
LDIXQ
SUBDICTURPGET
TUPLE
CALLCCVARARGS
QMULRSHIFTC_VAR
BREMBITREFS
DICTIMINREF
LSHIFTMODC_VAR
CONFIGOPTPARAM
STU_ALT
BLS_G2_MULTIEXP
DICTADDGETB
UNTRIPLE
STB
QFITS
BREMBITS
PLDUZ
SCHKBITS
HASHEXT_SHA256
DICTIREMMAX
RSHIFTMOD_VAR
ROT2
CHKTUPLE
NEWDICT
DICTISETREF
ROT
MULDIVMOD
DICTUREPLACE
STIR
SBITS
CALLDICT
SDBEGINSQ
QDIVR
HASHEXT_SHA512
SETCP0
NEWC
STIX
FITS
DICTUGETJMP
BLS_G1_NEG
ISPOS
SETCONTVARARGS
CALLDICT_LONG
DICTIREPLACEREF
MULRSHIFTCMOD_VAR
PREVMCBLOCKS
ADDDIVMODC
INC
QLSHIFTDIVR_VAR
DICTIDEL
DICTDEL
QINC
PLDIX
SETTHIRDQ
NOW
CADDR
LDSLICEQ
DICTUSETGETOPTREF
DICTIGETNEXTEQ
SDBEGINS
ADDRAND
STVARUINT32
DICTUADDREF
LDI_ALT
MULMODR
PARSEMSGADDRQ
DICTUDELGET
CDDDR
PLDULE8
STBRQ
MULMODPOW2C
CONFIGPARAM
LDVARUINT32
DICTIADDREF
IFNOTRET
DICTIADDGETB
QMULDIVR
INDEXQ
STBREFR
SENDRAWMSG
DIVMODR
LSHIFTDIV_VAR
RIST255_FROMHASH
RSHIFTRMOD
SUBSLICE
PLDILE8Q
DICTIREPLACEB
RSHIFTC_VAR
SDSKIPLAST
PLDUXQ
LSHIFTDIVMODR
P256_CHKSIGNS
RANDSEED
STI_ALT
DEC
MODPOW2C
QLSHIFTDIV
THROWARGIF
GETORIGINALFWDFEE
POP_LONG
STREFQ
PUXC2
BLS_G2_INGROUP
THROWANYIF
DICTREMMAXREF
SKIPDICT
AND
QPOW2
MODPOW2R_VAR
BDEPTH
DICTIADDB
DICTREPLACEGETREF
DICTIMIN
EXPLODE
LDVARINT32
COMPOSALT
FITSX
TPUSH
ROTREV
STULE4
PUSHSLICE_LONG
STBREFRQ
BLKDROP
CHASHI
IF
IFNOTRETALT
QDIVC
HASHEXTAR_BLAKE2B
DICTIADDGET
QRSHIFTC_VAR
DICTREMMAX
XCHG2
QRSHIFTMODC_VAR
SUBDICTUGET
WHILEEND
STUXQ
IFELSE
TWO
MUL
BCHKREFS
SDSKIPFIRST
ECRECOVER
DICTDELGETREF
PLDREF
DICTIDELGET
SCHKREFSQ
DICTSETB
DICTSETGETOPTREF
CDATASIZEQ
MULADDRSHIFTCMOD
QMULRSHIFTR_VAR
QMULRSHIFTMOD_VAR
LDDICT
PUXCPU
SINGLE
HASHSU
SDEMPTY
QADDRSHIFTRMOD
QMULRSHIFTCMOD
UNPACKFIRST
PUSHPOW2DEC
MULRSHIFTRMOD_VAR
CDDR
JMPREF
SUBDICTIGET
LDSLICEX
LDVARINT16
SETCONTARGS
DICTIREMMAXREF
QRSHIFTR_VAR
DICTMINREF
THENRETALT
PUSHCONT
PUSH_LONG
NOT
SDBEGINSX
IFNOTREF
LESSINT
UNTILENDBRK
DICTPUSHCONST
BLS_G2_ISZERO
SETGASLIMIT
MULRSHIFTMOD
LDSAME
PUSH3
QNEGATE
THROWARGANY
SDSFX
TRY
LSHIFTMODC
RSHIFTR_VAR
BLS_G1_INGROUP
STBREF
QLSHIFTDIVMOD
BLS_PAIRING
DICTREMMINREF
QLSHIFTDIVMODR
IFREFELSEREF
SETCP_SPECIAL
SETCONTCTRX
REWRITEVARADDRQ
MODPOW2R
HASHEXTA_KECCAK256
DICTIGETEXEC
STULE8
BLS_MAP_TO_G1
NULLROTRIF
ROLLX
MULMODPOW2R_VAR
QRSHIFTMODR_VAR
AGAINEND
BLS_G2_NEG
ONE
DICTUDEL
REVX
NULLROTRIFNOT2
DICTUDELGETREF
DICTREPLACEGETB
MODPOW2C_VAR
CHANGELIB
PUSHPOW2
DICTDELGET
QMULADDDIVMODR
TPOP
QLSHIFTDIVMOD_VAR
ROLL
LDSLICEXQ
STREF
STIXR
QMULRSHIFTC
BCHKBITREFS
SETALTCTR
STDICTS
STBR
OVER
LSHIFTMODR
CDEPTH
DICTUADDGETREF
ADDRSHIFTCMOD
QMULADDDIVMOD
POPCTR
DICTISETGETREF
DIVR
DICTUSETGET
QMODPOW2_VAR
SDLEXCMP
SCHKBITSQ
SDPFX
DICTUSETGETREF
RIST255_SUB
GEQ
LDILE8Q
QXOR
ISTUPLE
GETPRECOMPILEDGAS
BLS_VERIFY
MULRSHIFTRMOD
ISNAN
SPLIT
ADD
STU
PUSHCTR
SENDMSG
TUCK
DICTIGETNEXT
XCPUXC
PLDIQ
LDULE4
LDONES
TRIPLE
AGAINBRK
PLDU
DICTUREPLACEGETB
ISZERO
INCOMINGVALUE
PLDULE4Q
STIXQ
DROP2
IFNOT
LSHIFT
QLSHIFTDIVMODC_VAR
BLS_MAP_TO_G2
RAWRESERVE
RIST255_VALIDATE
QADDRSHIFTMODR
DICTADDGET
QDIV
BREFS
ONLYTOPX
SDCNTTRAIL0
HASHEXT_KECCAK256
LDILE4Q
PUSHINT_16
PLDIXQ
CHKNAN
DICTGETNEXT
SAMEALT
SETTHIRD
SETGLOB
ROLLREV
STBREFQ
RET
P256_CHKSIGNU
MULRSHIFT_VAR
LSHIFTDIVMOD_VAR
-ROLLX
HASHEXTR_KECCAK512
CHKSIGNU
RIST255_QVALIDATE
SETNUMVARARGS
BLS_G2_SUB
DUP
DICTIGETOPTREF
RSHIFTMODC_VAR
DICTUREPLACEREF
STONES
NEQINT
PLDSLICE
JMPXVARARGS
LSHIFTDIVC_VAR
SETCPX
RUNVMX
THIRDQ
SDPPFXREV
JMPDICT
LDIQ
WHILEENDBRK
INDEXVARQ
DICTREPLACE
SETCODE
RIST255_QADD
ADDCONST
LSHIFTADDDIVMOD
BLS_AGGREGATE
LDU_ALT
LDUQ
SUBR
RSHIFTCMOD
QADD
BCHKBITSQ
THROWARG
DICTIREPLACEGETREF
QMULADDRSHIFTCMOD
SETRETCTR
LSHIFTADDDIVMOD_VAR
BALANCE
THROWIF_SHORT
DICTIGET
RIST255_MULBASE
IFBITJMPREF
LAST
WHILE
XCHG_1I
LDDICTQ
DICTUREPLACEB
RSHIFT_VAR
QMULRSHIFTR
RIST255_QSUB
RETALT
BLS_PUSHR
STIQ
SETLIBCODE
PLDSLICEX
QLSHIFTMODR_VAR
SAMEALTSAVE
NIL
LDULE8Q
RIST255_ADD
BLESSARGS
SUBDICTGET
SETNUMARGS
QMODR
QMULDIVMODR
STURQ
SCHKBITREFSQ
DICTIREPLACEGET
MULMOD
MULMODC
SDCNTLEAD1
BBITREFS
TEN
STUX
ADDRSHIFTRMOD
DICTUGETNEXT
DICTUGETEXEC
OVER2
SDCUTFIRST
DICTGET
PFXDICTREPLACE
QMULMODC
MULRSHIFTMOD_VAR
GETGLOB
QMULADDRSHIFTMOD
XLOADQ
ABS
QOR
SDSUBSTR
JMPXARGS
SETINDEXVAR
LEQ
QLSHIFTMODR
BCHKBITS
UNPAIR
BLS_AGGREGATEVERIFY
HASHEXT_BLAKE2B
MODPOW2
QDIVMODC
QADDRSHIFTCMOD
STSLICE
STDICT
PUSHREFCONT
PUXC
DICTUREMMAXREF
TLEN
SCHKREFS
RSHIFTC
QRSHIFT
ADDRSHIFTMODC
DICTEMPTY
BREMREFS
CONDSEL
CHASHIX
PFXDICTCONSTGETJMP
UNPACKEDCONFIGTUPLE
SAVE
STSLICECONST
DICTIREPLACEGETB
DICTUADDGETB
LSHIFTMOD_VAR
DICTIADD
MOD
THENRET
BLKSWAP
BLS_G1_MUL
PUSHNAN
PLDSLICEQ
QMULADDDIVMODC
MULMODPOW2_VAR
QUFITSX
SBITREFS
SETFIRSTQ
DICTUREPLACEGET
LDSLICE_ALT
BCHKBITSQ_VAR
LDIX
JMPX
RETARGS
MYADDR
THROWIFNOT
JMPREFDATA
DICTISETGETOPTREF
QMULRSHIFTCMOD_VAR
QLSHIFTADDDIVMODR_VAR
HASHEXTA_BLAKE2B
UNSINGLE
DICTREPLACEREF
PUSHINT_8
BCHKBITS_VAR
HASHEXTAR_SHA256
CTOS
IFRETALT
PARSEMSGADDR
DICTUSETREF
STVARINT32
PLDULE4
MULRSHIFTC
PLDSLICEXQ
DICTISETGET
QMOD
STSLICERQ
XLOAD
CHKSIGNS
PLDREFVAR
BLESSVARARGS
PUSHROOT
MAX
LDUX
CALLXARGS_VAR
CLEVELMASK
SETCONTARGS_N
QSUB
SCUTLAST
QMODPOW2C_VAR
REWRITESTDADDR
LDBLOB
ADDRSHIFT
ADDRSHIFTR
ADDRSHIFTRMOD
ADDRSHIFTC
MULADDRSHIFT
MULADDRSHIFTR
MULADDRSHIFTRMOD
HASHEXT
HASHEXTR
HASHEXTA
HASHEXTAR
CHKSIGN
SETCODEPAGE
MULADDRSHIFTC
SETCODEPAGE
PUSHINT


================================================
FILE: src/hooks/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/hooks/index.ts
================================================
export * from './use-debounce';



================================================
FILE: src/hooks/use-debounce.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/hooks/use-debounce.ts
================================================
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value],
  );

  return debouncedValue;
}



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/bridge.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/bridge.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md" />

export default Page;



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/index.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect" />

export default Page;



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/requests-responses.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/requests-responses.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md" />

export default Page;



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/session.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/session.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect/blob/main/session.md" />

export default Page;



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/wallet-guidelines.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/wallet-guidelines.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md" />

export default Page;



================================================
FILE: src/pages/develop/dapps/ton-connect/protocol/workflow.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/develop/dapps/ton-connect/protocol/workflow.tsx
================================================
import RedirectPage from '@site/src/components/RedirectPage';
import React from 'react';

const Page = () => <RedirectPage redirectUrl="https://github.com/ton-blockchain/ton-connect/blob/main/workflows.md" />

export default Page;



================================================
FILE: src/pages/hacktonberfest.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/hacktonberfest.tsx
================================================
import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import ContentBlock from "@site/src/components/contentBlock";
import './index.module.css'

const content = [
  {
    title: "What is Hacktoberfest?",
    status: "Everyone curious about TON",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Read more about the event and why it's so cool to start right now!"
  },
  {
    title: "Contribute to TON",
    status: "Open-source Developer",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022/as-contributor",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Participate in open-source and receive cool rewards from TON."
  },
  {
    title: "Prepare Repository",
    status: "Open-source Maintainer",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022/as-maintainer",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Improve your open-source project with help of active TON community."
  },
];



export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

    <Layout title={"Hack-TON-berfest 🎃"} description={"Welcome to Hack-TON-berfest! Join a month-long celebration of open-source projects, their maintainers, and the entire community of contributors! Each October, open source maintainers give new contributors extra attention as they guide developers through their first pull requests."}>
      <div
        className="bootstrap-wrapper"
      >
        <br/>
        <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Welcome to Hack-TON-berfest 🎃</h1>
        <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start journey:</p>

        <div className="container">

          <div id="Get Started" className="row">
            {content &&
                            content.length &&
                            content.map((props, idx) => (
                              <ContentBlock key={idx} {...props} />
                            ))}{" "}
          </div>

          <br/>
          <br/>

          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>List of repositories to Contribute 🛠</h1>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Here is a list of repositories in TON Ecosystem who awaits of contributors right now:</p>

          <iframe className="airtable-embed"
            src="https://airtable.com/embed/shrVIgLZqTdFtXFaZ?backgroundColor=blue&viewControls=on"
            frameBorder="0" width="100%" height="533"
            style={{background: 'transparent', border: '1px solid #ccc'}}></iframe>

          <br/>
          <br/>

          <h2 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Want to join to this list? 🚀</h2>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Please, read the page for maintainers and fill the form — <a href={"/contribute/hacktoberfest/as-maintainer"}>join as maintainer</a>. It's easy now!</p>

          <br/>
          <br/>


          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Claim your NFT as proof of participating 💎</h1>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px',maxWidth:'600px', margin:'0 auto' }}>Every participant (maintainer and contributor) to any of TON Ecosystem projects will receive <b><a href="/contribute/hacktoberfest/#what-the-rewards">Limited Hack-TON-berfest NFT</a></b>:</p>

          <div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
            <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'30pt auto 20pt'}} muted={true} autoPlay={true} loop={true}>
              <source src="/files/nft-sm.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
            </video>
          </div>

          <br/>

          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>FAQ for Contributors</h1>

          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Before asking any question in the chats, please read answers here first.</p>
          <iframe className="airtable-embed"
            src="https://airtable.com/embed/shrmS5ccK1Ez8Zc7q/tbldsJlX5kJoVXV48?backgroundColor=blue&viewControls=on"
            frameBorder="0" width="100%" height="533"
            style={{background: 'transparent', border: '1px solid #ccc'}}></iframe>

          <br/>
          <br/>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>If you have any specific questions, feel free to ask in <a href={"https://t.me/TonDev_eng"}>TON Dev Chat</a> to get help.</p>

          <br/>
          <br/>

        </div>
      </div>


    </Layout>
  );
}



================================================
FILE: src/pages/index.module.css
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/index.module.css
================================================
/**
 * CSS files with the .module.css suffix will be treated as CSS modules
 * and scoped locally.
 */

.heroBanner {
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

@media screen and (max-width: 996px) {
  .heroBanner {
    padding: 2rem;
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}



================================================
FILE: src/pages/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/index.tsx
================================================
import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import {firstRow} from "../data/features";
import ContentBlock from "@site/src/components/contentBlock";
import './index.module.css'

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

    <Layout title={"Start"} description={"Learn about the basics of blockchain and TON and how to get started. TON is blockchain of blockchains with a masterchain to rule them all. You can learn more about general architecture in Basic Concepts section."}>
      <div
        className="bootstrap-wrapper"
      >
        <br/>
        <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}><span>Welcome to the TON <br/> Blockchain documentation </span> <span className='mobile-view'>Welcome to <br/> TON Blockchain <br/> documentation</span></h1>
        <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start journey</p>

        <div className="container">

          <div id="Get Started" className="row">
            {firstRow &&
                                  firstRow.length &&
                                  firstRow.map((props, idx) => (
                                    <ContentBlock key={idx} {...props} />
                                  ))}{" "}
          </div>

          <br/>
          <p style={{ fontWeight: '300', textAlign:'center', padding: '10px 0', fontSize:'16px' }}>Tip: search everywhere with <code>Ctrl+K</code> hotkey</p>
        </div>
      </div>
    </Layout>
  );
}



================================================
FILE: src/pages/v3/documentation/tvm/instructions.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/src/pages/v3/documentation/tvm/instructions.mdx
================================================
---
hide_table_of_contents: true
wrapperClassName: bootstrap-wrapper
---

import { InstructionSearch } from '@site/src/components/Instructions';
import { cp0 } from '@site/src/data/opcodes';

# TVM Instructions

:::caution advanced level
This information is **very low-level** and could be hard to understand for newcomers.
So feel free to read about it later.
:::

* [Exit From TVM Instruction Full Screen Mode](/v3/documentation/tvm/tvm-overview)

## Introduction
This document provides a list of TVM instructions along with their opcodes and mnemonics.

:::info
* [**TVM.pdf**](https://ton.org/tvm.pdf) concept document for TON Virtual Machine (may include outdated information).
* [TVM Retracer](https://retracer.ton.org/)
:::

Fift is a stack-based programming language designed to manage TON smart contracts. The Fift assembler is a Fift library that converts mnemonics of TVM instructions into their binary representation.

A description of Fift, including an introduction to the Fift assembler, can be found [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md).

This document specifies the corresponding mnemonic for each instruction.

Note the following:

1. Fift is a stack-based language, therefore all the arguments of any instruction are written before it (e.g. [`5 PUSHINT`](/v3/documentation/tvm/instructions#7i), [`s0 s4 XCHG`](/v3/documentation/tvm/instructions#10ij)).
2. Stack registers are denoted by `s0, s1, ..., s15`. Other stack registers (up to 255) are denoted by `i s()` (e.g. `100 s()`).
3. Control registers are denoted by `c0, c1, ..., c15`.

### Gas prices

The gas price of each instruction is specified in this document. The basic gas price of an instruction is `10 + b`, where `b` is the instruction length in bits. Some operations have additional fees:
1. _Parsing cells_: Transforming a cell into a slice costs **100 gas units** if the cell is loading for the first time and **25** for subsequent loads during the same transaction. For such instructions, two gas prices are specified (e.g. [`CTOS`](/v3/documentation/tvm/instructions#D0): `118/43`).
2. _Cell creation_: **500 gas units**.
3. _Throwing exceptions_: **50 gas units**. In this document the exception fee is only specified for an instruction if its primary purpose is to throw (e.g. [`THROWIF`](/v3/documentation/tvm/instructions#F26_n), [`FITS`](/v3/documentation/tvm/instructions#B4cc)). If the instruction only throws in some cases, two gas prices are specified (e.g. [`FITS`](/v3/documentation/tvm/instructions#B4cc): `26/76`).
4. _Tuple creation_: **1 gas unit** for every tuple element.
5. _Implicit jumps_: **10 gas units** for an implicit jump, **5 gas units** for an implicit back jump. This fee is not a part of any instruction.
6. _Moving stack elements between continuations_: **1 gas unit** per element, however moving the first 32 elements is free.


### Quick search

:::info
A full machine-readable list of TVM instructions is available [here](https://github.com/ton-community/ton-docs/blob/main/src/data/opcodes).
:::


Each section of TVM Instructions includes a built-in search component for finding opcodes specific to that section as well.

On this page, however, the search covers all existing opcodes, providing a comprehensive search option across the entire opcode range.

Feel free to use the search field below to find a specific instruction:

<InstructionSearch instructions={cp0.instructions} aliases={cp0.aliases}/>

* [Exit From TVM Instruction Full Screen Mode](/v3/documentation/tvm/tvm-overview)



================================================
FILE: src/theme/Footer/Footer.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Footer.scss
================================================
@import "./styles/all";

.CustomFooter {
  margin-top: 100px;

  @include media-breakpoint-m {
    margin-top: 52px;
  }

  .container {
    position: relative;
  }

  &--m-scheme-light {
    background: var(--background-page-light);
  }

  &--m-scheme-dark {
    background: var(--background-page-dark);
  }

  &--with-small-offset {
    margin-top: 46px;

    @include media-breakpoint-xxl {
      margin-top: 26px;
    }
    @include media-breakpoint-m {
      margin-top: 16px;
    }
  }

  @media (max-width: 576px) {
    &__links,
    &__copyrights {
      padding: 0 16px;
    }
  }

  .Logo__inner {
    &--large {
      display: block;

      @include media-breakpoint-l {
        display: none;
      }
    }

    &--small {
      display: none;

      @include media-breakpoint-l {
        display: block;
      }
    }
  }

  &__links {
    position: relative;
    padding-bottom: 24px;

    @include media-breakpoint-s {
      padding-top: 16px;
    }
  }

  &__colHeader {
    color: var(--text-primary-light);
    line-height: 24px;
  }

  &--m-scheme-dark &__colHeader {
    color: var(--text-primary-dark);
  }

  &__colLinks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;

    @include media-breakpoint-tablet-s {
      margin-top: 12px;
    }
  }

  &--m-scheme-light &__colLink {
    color: var(--text-tertiary-light);
  }

  &--m-scheme-light &__colLink div {
    @include hover-state {
      &:hover {
        color: var(--accent-hover-light);
      }
    }
  }

  &--m-scheme-dark &__colLink {
    color: var(--text-tertiary-dark);
  }

  &--m-scheme-dark &__colLink div {
    @include hover-state {
      &:hover {
        color: var(--accent-hover-dark);
      }
    }
  }

  &__copyrights {
    display: flex;
    padding: 26px 0px;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 576px) {
      padding: 26px 16px;
    }

    @include media-breakpoint-tablet-s {
      padding: 24px 0 32px;
    }
    @include media-breakpoint-desktop {
      padding: 24px 0 40px;
    }
  }

  &--m-scheme-dark &__copyrights {
    border-top-color: var(--separator-alpha-dark);
  }

  &--m-scheme-light &__copyrights {
    border-top-color: var(--separator-alpha-light);
  }

  &__copyrightsLeft {
    color: var(--text-tertiary-light);
  }

  &--m-scheme-dark &__copyrightsLeft {
    color: var(--text-tertiary-dark);
  }

  &__network rect,
  &__network:nth-child(4) circle,
  &__network path {
    transition: $def-trans-duration all;
  }

  &--m-scheme-dark &__network path {
    fill: var(--icon-secondary-dark);
  }

  &--m-scheme-dark &__network:hover path {
    fill: var(--accent-hover-dark);
  }

  &--m-scheme-light &__network path {
    fill: var(--icon-secondary-light);
  }

  &--m-scheme-light &__network:hover path {
    fill: var(--accent-hover-light);
  }

  &--m-scheme-dark &__network rect,
  &--m-scheme-dark &__network:nth-child(4) circle {
    fill: var(--icon-secondary-dark);
  }

  &__networks {
    display: flex;
    gap: 4px;
  }

  &__network {
    color: var(--icon_light_thirdly);

    @include hover-state {
      &:hover {
        color: var(--accent-hover-light);
      }
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
}



================================================
FILE: src/theme/Footer/GridSystem/NewCol/NewCol.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/GridSystem/NewCol/NewCol.scss
================================================
@import "../../styles/all";

.NewCol {
  box-sizing: border-box;
  //position: relative;
  padding-left: calc(#{var(--mobileGridGap)} / 2 * 1px);
  padding-right: calc(#{var(--mobileGridGap)} / 2 * 1px);

  &.withoutPaddings {
    padding: 0;
  }

  @include media-breakpoint-tablet-s {
    padding-left: calc(#{var(--tabletSGridGap)} / 2 * 1px);
    padding-right: calc(#{var(--tabletSGridGap)} / 2 * 1px);
  }

  @include media-breakpoint-tablet-m {
    padding-left: calc(#{var(--tabletMGridGap)} / 2 * 1px);
    padding-right: calc(#{var(--tabletMGridGap)} / 2 * 1px);
  }

  @include media-breakpoint-desktop {
    padding-left: calc(#{var(--desktopGridGap)} / 2 * 1px);
    padding-right: calc(#{var(--desktopGridGap)} / 2 * 1px);
  }

  @include media-breakpoint-desktop-large {
    padding-left: calc(#{var(--desktopLargeGridGap)} / 2 * 1px);
    padding-right: calc(#{var(--desktopLargeGridGap)} / 2 * 1px);
  }
}



================================================
FILE: src/theme/Footer/GridSystem/NewCol/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/GridSystem/NewCol/index.tsx
================================================
import "./NewCol.scss";
import React, { FC } from "react";

interface INewColProps {
  className?: string;
  withoutPaddings?: boolean;
  children: React.ReactNode;
}

export const NewCol: FC<INewColProps> = (props) => {
  const {
    className = "",
    children,
    withoutPaddings = false,
    ...otherProps
  } = props;

  return (
    <div
      className={`NewCol ${className} ${
        (`withoutPaddings` && Boolean(withoutPaddings)) || ""
      }`}
      {...otherProps}
    >
      {children}
    </div>
  );
};



================================================
FILE: src/theme/Footer/GridSystem/NewRow/NewRow.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/GridSystem/NewRow/NewRow.scss
================================================
@import "../../styles/all";

.NewRow {
  display: grid;
  row-gap: calc(#{var(--mobileGridGap)} * 1px);
  grid-template-columns: var(--mobileGridSize);
  margin-left: calc(#{var(--mobileGridGap)} / 2 * -1px);
  width: calc(100% + #{var(--mobileGridGap)} * 1px);
  box-sizing: border-box;

  &.withoutPaddings {
    width: 100%;
    margin-left: 0;
  }

  @include media-breakpoint-tablet-s {
    row-gap: calc(#{var(--tabletSGridGap)} * 1px);
    grid-template-columns: var(--tabletSGridSize);
    margin-left: calc(#{var(--tabletSGridGap)} / 2 * -1px);
    width: calc(100% + #{var(--tabletSGridGap)} * 1px);
  }

  @include media-breakpoint-tablet-m {
    row-gap: calc(#{var(--tabletMGridGap)} * 1px);
    grid-template-columns: var(--tabletMGridSize);
    margin-left: calc(#{var(--tabletMGridGap)} / 2 * -1px);
    width: calc(100% + #{var(--tabletMGridGap)} * 1px);
  }

  @include media-breakpoint-desktop {
    row-gap: calc(#{var(--desktopGridGap)} * 1px);
    grid-template-columns: var(--desktopGridSize);
    margin-left: calc(#{var(--desktopGridGap)} / 2 * -1px);
    width: calc(100% + #{var(--desktopGridGap)} * 1px);
  }

  @include media-breakpoint-desktop-large {
    row-gap: calc(#{var(--desktopLargeGridGap)} * 1px);
    grid-template-columns: var(--desktopLargeGridSize);
    margin-left: calc(#{var(--desktopLargeGridGap)} / 2 * -1px);
    width: calc(100% + #{var(--desktopLargeGridGap)} * 1px);
  }


  &-m-left-triangle {

    @include media-breakpoint-tablet-s {
      grid-template-areas: 'first second'
                          'first third';

      .Col:first-child {
        grid-area: first;
        height: 100%;
      }

      .Col:nth-child(n + 2) {

        & > a {
          display: flex;
        }
      }
    }
  }
}



================================================
FILE: src/theme/Footer/GridSystem/NewRow/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/GridSystem/NewRow/index.tsx
================================================
import "./NewRow.scss";
import React, { CSSProperties, FC, useMemo } from "react";

export const GRID_COLUMNS_COUNT = 12;

export type GutterConfigType = {
  mobile: number;
  tabletS: number;
  tabletM: number;
  desktop: number;
  desktopLarge?: number;
};

export type SizeConfigType = {
  mobile: number | Array<number>;
  tabletS: number | Array<number>;
  tabletM: number | Array<number>;
  desktop: number | Array<number>;
  desktopLarge?: number | Array<number>;
};

export type NewRowJustifyType = "flex-start" | "space-between";

interface INewRowProps {
  gutterConfig?: GutterConfigType;
  sizeConfig?: SizeConfigType;
  className?: string;
  justify?: NewRowJustifyType;
  noGutter?: boolean;
  gridLayout?: "left-triangle";
  withoutPaddings?: boolean;
  children: React.ReactNode;
}

interface NewRowCssType extends CSSProperties {
  "--mobileGridGap": number;
  "--tabletSGridGap": number;
  "--tabletMGridGap": number;
  "--desktopGridGap": number;
  "--desktopLargeGridGap": number;
  "--mobileGridSize": string;
  "--tabletSGridSize": string;
  "--tabletMGridSize": string;
  "--desktopGridSize": string;
  "--desktopLargeGridSize": string;
}

export const NewRow: FC<INewRowProps> = (props) => {
  const {
    gutterConfig = {
      mobile: 16,
      tabletS: 16,
      tabletM: 16,
      desktop: 40,
      desktopLarge: 40,
    },
    sizeConfig = {
      mobile: 12,
      tabletS: 12,
      tabletM: 12,
      desktop: 6,
      desktopLarge: 6,
    },
    children,
    className = "",
    noGutter = false,
    gridLayout = "",
    withoutPaddings = false,
    ...otherProps
  } = props;

  function getIsSizePrimitiveType(size: number | Array<number>) {
    if (typeof size === "number") {
      return true;
    }
    return false;
  }

  function getCommonColumnsLayoutGrid(size: number) {
    return `repeat(auto-fill, calc((100% / ${GRID_COLUMNS_COUNT}) * ${size}))`;
  }

  function getCustomColumnsLayoutGrid(columns: Array<number>) {
    return columns.map((num) => num + "fr").join(" ");
  }

  const NewRowStyles: NewRowCssType = useMemo(() => {
    const desktopLargeSize = sizeConfig.desktopLarge
      ? sizeConfig.desktopLarge
      : sizeConfig.desktop;
    const desktopLargeGutter = gutterConfig.desktopLarge
      ? gutterConfig.desktopLarge
      : gutterConfig.desktop;
    return {
      "--mobileGridGap": noGutter ? 0 : gutterConfig.mobile,
      "--tabletSGridGap": noGutter ? 0 : gutterConfig.tabletS,
      "--tabletMGridGap": noGutter ? 0 : gutterConfig.tabletM,
      "--desktopGridGap": noGutter ? 0 : gutterConfig.desktop,
      "--desktopLargeGridGap": noGutter ? 0 : desktopLargeGutter,

      "--mobileGridSize": getIsSizePrimitiveType(sizeConfig.mobile)
        ? getCommonColumnsLayoutGrid(sizeConfig.mobile as number)
        : getCustomColumnsLayoutGrid(sizeConfig.mobile as Array<number>),

      "--tabletSGridSize": getIsSizePrimitiveType(sizeConfig.tabletS)
        ? getCommonColumnsLayoutGrid(sizeConfig.tabletS as number)
        : getCustomColumnsLayoutGrid(sizeConfig.tabletS as Array<number>),

      "--tabletMGridSize": getIsSizePrimitiveType(sizeConfig.tabletM)
        ? getCommonColumnsLayoutGrid(sizeConfig.tabletM as number)
        : getCustomColumnsLayoutGrid(sizeConfig.tabletM as Array<number>),

      "--desktopGridSize": getIsSizePrimitiveType(sizeConfig.desktop)
        ? getCommonColumnsLayoutGrid(sizeConfig.desktop as number)
        : getCustomColumnsLayoutGrid(sizeConfig.desktop as Array<number>),

      "--desktopLargeGridSize": getIsSizePrimitiveType(desktopLargeSize)
        ? getCommonColumnsLayoutGrid(desktopLargeSize as number)
        : getCustomColumnsLayoutGrid(desktopLargeSize as Array<number>),
    };
  }, [sizeConfig, noGutter, gutterConfig]);

  return (
    <div
      className={`NewRow ${className} ${
        (`NewRow-m-${gridLayout}` && Boolean(gridLayout)) || ""
      } ${(`withoutPaddings` && Boolean(withoutPaddings)) || ""}`}
      style={NewRowStyles}
      {...otherProps}
    >
      {children}
    </div>
  );
};



================================================
FILE: src/theme/Footer/GridSystem/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/GridSystem/index.ts
================================================
export { NewCol } from "./NewCol";
export { NewRow } from "./NewRow";



================================================
FILE: src/theme/Footer/Logo/Logo.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Logo/Logo.scss
================================================
@import "../styles/all";

.Logo {
  position: relative;
  display: block;
  cursor: pointer;
  @include with-transition(color);

  &__inner {
    display: block;

    &--large {
      @include media-breakpoint-xl {
        display: none;
      }
    }

    &--small {
      display: none;

      @include media-breakpoint-xl {
        display: block;
      }
    }
  }

  &--dark {
    color: var(--basic-white) !important;
  }

  &--light {
    color: var(--basic-black) !important;
  }
}

$caret-width: 24px;
$caret-height: 8px;
$logo-dropdown-vertical-padding: 6px;
$logo-dropdown-vertical-offset: 10px;
$logo-dropdown-shadow-color: 4px 4px 16px rgba(35, 35, 40, 0.08);



================================================
FILE: src/theme/Footer/Logo/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Logo/index.tsx
================================================
import React, { FC } from "react";
import "./Logo.scss";
import { IconLogo, IconLogoSmall } from "../../../assets/icons/index";

interface LogoProps {
  scheme?: "dark" | "light";
}

export const Logo: FC<LogoProps> = ({ scheme }) => {
  return (
    <a className={`Logo Logo--${scheme}`} href="/">
      <div className="Logo__inner Logo__inner--large">
        <IconLogo />
      </div>
      <div className="Logo__inner Logo__inner--small">
        <IconLogoSmall />
      </div>
    </a>
  );
};



================================================
FILE: src/theme/Footer/NetworkIcon/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/NetworkIcon/index.tsx
================================================
import React, { FC } from "react";
import {
  Icon24MailCircle,
  Icon24GithubCircle,
  Icon24LinkedInCircle,
  Icon24TelegramCircle,
  Icon24TwitterCircle,
  Icon24CoinMakertCap,
} from "../../../assets/icons/index";

import type { Network } from "../config";

interface NetworkIconProps {
  type: Network;
}

export const NetworkIcon: FC<NetworkIconProps> = ({ type }) => {
  switch (type) {
  case "coinmarketcap":
    return <Icon24CoinMakertCap />;
  case "telegram":
    return <Icon24TelegramCircle />;
  case "github":
    return <Icon24GithubCircle />;
  case "twitter":
    return <Icon24TwitterCircle />;
  case "mail":
    return <Icon24MailCircle />;
  case "linkedin":
    return <Icon24LinkedInCircle />;
  default:
    return null;
  }
};



================================================
FILE: src/theme/Footer/Separator/Separator.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Separator/Separator.scss
================================================
@import "../styles/all";

.Separator {
  width: 100%;
  height: 1px;
  opacity: 0.5;

  &--m-scheme-light {
    background: var(--separator-alpha-light);
  }

  &--m-scheme-dark {
    background: var(--separator-alpha-dark);
  }
}



================================================
FILE: src/theme/Footer/Separator/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Separator/index.tsx
================================================
import React, { HTMLAttributes } from "react";
import "./Separator.scss";

export interface ISeparatorProps extends HTMLAttributes<HTMLElement> {
  scheme: "dark" | "light";
}

export const Separator: React.FC<ISeparatorProps> = (props) => {
  const { scheme = "light", className, ...otherProps } = props;

  return (
    <div
      className={`Separator Separator--m-scheme-${scheme} ${className}`}
      {...otherProps}
    ></div>
  );
};



================================================
FILE: src/theme/Footer/Typography/Caption/Caption.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Typography/Caption/Caption.scss
================================================
@import "../../styles/all";

.Caption {
  @include font-inter;
  font-size: $font-size-small-xs;
  line-height: $line-height-small-s;

  p {
    overflow: visible;
  }

  @include media-breakpoint-tablet-m {
    font-size: $font-size-small-s;
  }

  &--weight-medium {
    font-weight: $font-weight-medium;
  }

  &--scheme-light {
    &.Caption--color {
      &-tertiary {
        color: var(--text-tertiary-light);
      }
    }

    &--scheme-dark {
      &.Caption--color {
        &-tertiary {
          color: var(--text-tertiary-dark);
        }
      }
    }
  }
}



================================================
FILE: src/theme/Footer/Typography/Caption/Caption.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Typography/Caption/Caption.tsx
================================================
import React, { FC } from "react";
import "./Caption.scss";

interface CaptionProps {
  scheme?: "dark" | "light";
  children: string;
}

export const Caption: FC<CaptionProps> = (props) => {
  const { children, scheme = "light", ...restProps } = props;

  return (
    <div
      className={`Caption Caption--weight-medium Caption--scheme-${scheme} Caption--color-tertiary`}
      {...restProps}
    >
      {children}
    </div>
  );
};



================================================
FILE: src/theme/Footer/Typography/Text/Text.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Typography/Text/Text.scss
================================================
@import "../../styles/all";

.Text {
  @include font-inter;

  &--weight-semi {
    font-weight: $font-weight-semi-bold;
  }

  &--scheme-light {
    color: var(--text-secondary-light);
  }

  &--scheme-dark {
    color: var(--text-secondary-dark);
  }

  &--level-1 {
    font-size: $text-1-font-size-mobile;
    line-height: $text-1-line-height-mobile;

    @include media-breakpoint-desktop {
      font-size: $text-1-font-size-desktop;
      line-height: $text-1-line-height-desktop;
    }
  }
}



================================================
FILE: src/theme/Footer/Typography/Text/Text.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Typography/Text/Text.tsx
================================================
import "./Text.scss";
import React, { FC } from "react";

interface TextProps {
  scheme?: "dark" | "light";
  className: string;
  children: string;
}

export const Text: FC<TextProps> = (props) => {
  const { scheme = "light", children, className, ...restProps } = props;

  return (
    <div
      className={`Text Text--weight-semi Text--level-1 Text--scheme-${scheme} ${className}`}
      {...restProps}
    >
      {children}
    </div>
  );
};



================================================
FILE: src/theme/Footer/Typography/index.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/Typography/index.ts
================================================
export { Text } from './Text/Text';
export { Caption } from './Caption/Caption';


================================================
FILE: src/theme/Footer/config.ts
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/config.ts
================================================
// social networks
const TON_LINKEDIN_URL = "https://www.linkedin.com/company/ton-blockchain/";
const TONCOIN_TELEGRAM_URL = "https://t.me/toncoin";
const GITHUB_URL = "https://github.com/ton-blockchain";
const TON_TWITTER_URL = "https://twitter.com/ton_blockchain";
const MAIL_TO_URL = "mailto:partnership@ton.org";
const COIN_MARKETCAP_URL = "https://coinmarketcap.com/currencies/toncoin/";

export type Network =
  | "telegram"
  | "github"
  | "twitter"
  | "mail"
  | "linkedin"
  | "coinmarketcap"
  | "website";

interface INetwork {
  type: Network;
  url: string;
}
export const NETWORKS: Array<INetwork> = [
  { type: "linkedin", url: TON_LINKEDIN_URL },
  { type: "telegram", url: TONCOIN_TELEGRAM_URL },
  { type: "github", url: GITHUB_URL },
  { type: "twitter", url: TON_TWITTER_URL },
  { type: "mail", url: MAIL_TO_URL },
  { type: "coinmarketcap", url: COIN_MARKETCAP_URL },
];

// footer links
const PAGE_TON_COIN = "https://ton.org/toncoin";
const PAGE_STAKE = "https://ton.org/stake";
const PAGE_VALIDATOR = "https://ton.org/validator";
const PAGE_MINING = "https://ton.org/mining";
const PAGE_COMMUNITY = "https://ton.org/community";
const PAGE_ROADMAP = "https://ton.org/roadmap";
const PAGE_ANALYSIS = "https://ton.org/comparison_of_blockchains.pdf";
const PAGE_BRAND_ASSETS = "https://ton.org/brand-assets";
const PAGE_GRANTS = "https://ton.org/grants";
const PAGE_BUY_TONCOIN = "https://ton.org/buy-toncoin";
const PAGE_EVENTS = "https://ton.org/events";
const PAGE_WALLETS = "https://ton.org/wallets";
const PAGE_DEV = "https://ton.org/dev";
const PAGE_CONTACT_US = "https://ton.org/contact-us";
const PAGE_COLLABORATE = "https://ton.org/collaborate";
const PAGE_LIQUIDITY_PROGRAM = "https://ton.org/defi-liquidity-program";
const TON_DEV_COMMUNITY_TELEGRAM_URL = "https://t.me/tondev_eng";
const WHITEPAPER_URL = "https://ton.org/whitepaper.pdf";
const TON_DOCUMENTATION_URL = "https://docs.ton.org/";
const APP_AND_DAPPS_URL = "https://t.me/tapps_bot/center?startApp=section_web3-tonorgtma";
const BRIDGE_URL = "https://bridge.ton.org";
const DNS_URL = "https://dns.ton.org/";
const CAREERS_URL = "https://jobs.ton.org/jobs";
const BUG_BOUNTY_URL = "https://github.com/ton-blockchain/bug-bounty";
const TON_OVERFLOW_URL = "https://tonresear.ch";
const TON_CONCEPT_URL = "v3/concepts/dive-into-ton/introduction";
const TON_FOOTSTEPS = "https://github.com/ton-society/ton-footsteps";
const TON_BLOG_PRESS_RELEASES_URL = "https://blog.ton.org/category/news";
const TONSTAT_URL = "https://www.tonstat.com/";
const TON_BLOG_URL = "https://blog.ton.org";
const TON_FOUNDATION_URL = "https://ton.foundation/";
const TON_THE_OPEN_LEAGUE = "https://ton.org/open-league";
const TON_USDT_ON_TON = "https://ton.org/borderless";
const TON_ACCEPT_PAYMENT = "https://ton.org/payments";
const FOOTER_DECENTRALIZED_NETWORK = "https://ton.org/decentralized-network";
const FOOTER_APP_AND_DAPPS_URL = APP_AND_DAPPS_URL;
const FOOTER_WHITEPAPER_URL = WHITEPAPER_URL;
const FOOTER_DOCUMENTATION_URL = TON_DOCUMENTATION_URL;
const FOOTER_DEV_COMMUNITY_URL = TON_DEV_COMMUNITY_TELEGRAM_URL;
const FOOTER_BUG_BOUNTY_URL = BUG_BOUNTY_URL;
const FOOTER_TON_OVERFLOW_URL = TON_OVERFLOW_URL;
const FOOTER_BRIDGE_URL = BRIDGE_URL;
const FOOTER_CAREERS_URL = CAREERS_URL;
const FOOTER_DNS_URL = DNS_URL;
const FOOTER_SUPPORT_AND_FEEDBACK = "https://t.me/ton_help_bot";
const FOOTER_TON_CONCEPT_URL = TON_CONCEPT_URL;
const FOOTER_TON_FOOTSTEPS_URL = TON_FOOTSTEPS;
const FOOTER_PRESS_RELEASES_URL = TON_BLOG_PRESS_RELEASES_URL;

export const FOOTER_COLUMN_LINKS_EN = [
  {
    headerLangKey: "Use",
    links: [
      { langKey: "Get a wallet", url: PAGE_WALLETS },
      { langKey: "Get or sell Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "Stake", url: PAGE_STAKE },
      { langKey: "Accept Payments", url: TON_ACCEPT_PAYMENT },
      { langKey: "Apps & Services", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "Bridge", url: FOOTER_BRIDGE_URL },
      { langKey: "Domains", url: FOOTER_DNS_URL },
      { langKey: "The Open League", url: TON_THE_OPEN_LEAGUE },
      { langKey: "USDT on TON", url: TON_USDT_ON_TON },
    ],
  },
  {
    headerLangKey: "Learn",
    links: [
      { langKey: "TON Concept", url: FOOTER_TON_CONCEPT_URL }, // it doesn't work, cause we use updated doc URL
      { langKey: "Decentralized Network", url: FOOTER_DECENTRALIZED_NETWORK },
      { langKey: "Roadmap", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "History of mining", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TON_COIN },
      { langKey: "Validators", url: PAGE_VALIDATOR },
      { langKey: "Blockchain comparison", url: PAGE_ANALYSIS },
      { langKey: "White paper", url: FOOTER_WHITEPAPER_URL },
    ],
  },
  {
    headerLangKey: "For Developers",
    links: [
      { langKey: "Getting started", url: PAGE_DEV },
      { langKey: "Documentation", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "TON Overflow", url: FOOTER_TON_OVERFLOW_URL },
      { langKey: "Dev Community", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "Grants", url: PAGE_GRANTS },
      { langKey: "Liquidity Program", url: PAGE_LIQUIDITY_PROGRAM },
      { langKey: "TON Footsteps", url: FOOTER_TON_FOOTSTEPS_URL },
      { langKey: "Bug Bounty", url: FOOTER_BUG_BOUNTY_URL },
    ],
  },
  {
    headerLangKey: "Community",
    links: [
      { langKey: "Communities", url: PAGE_COMMUNITY },
      { langKey: "TON Foundation", url: TON_FOUNDATION_URL },
      { langKey: "Events", url: PAGE_EVENTS },
      { langKey: "Collaborate", url: PAGE_COLLABORATE },
      { langKey: "Blog", url: TON_BLOG_URL },
      { langKey: "Press releases", url: FOOTER_PRESS_RELEASES_URL },
      { langKey: "Careers", url: FOOTER_CAREERS_URL },
    ],
  },
  {
    headerLangKey: "Other",
    links: [
      { langKey: "Support and Feedback", url: FOOTER_SUPPORT_AND_FEEDBACK },
      { langKey: "Brand assets", url: PAGE_BRAND_ASSETS },
      { langKey: "Contact us", url: PAGE_CONTACT_US },
    ],
  },
];

export const FOOTER_COLUMN_LINKS_CN = [
  {
    headerLangKey: "使用",
    links: [
      { langKey: "获取钱包", url: PAGE_WALLETS },
      { langKey: "获取或出售Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "质押", url: PAGE_STAKE },
      { langKey: "应用和服务", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "桥接", url: FOOTER_BRIDGE_URL },
      { langKey: "域名", url: FOOTER_DNS_URL },
    ],
  },
  {
    headerLangKey: "学习",
    links: [
      { langKey: "TON概念", url: FOOTER_TON_CONCEPT_URL },
      { langKey: "路线图", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "挖矿历史", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TON_COIN },
      { langKey: "验证者", url: PAGE_VALIDATOR },
      { langKey: "区块链比较", url: PAGE_ANALYSIS },
      { langKey: "白皮书", url: FOOTER_WHITEPAPER_URL },
    ],
  },
  {
    headerLangKey: "构建",
    links: [
      { langKey: "入门指南", url: PAGE_DEV },
      { langKey: "文档", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "TON Overflow", url: FOOTER_TON_OVERFLOW_URL },
      { langKey: "开发社区", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "赠款", url: PAGE_GRANTS },
      { langKey: "流动性计划", url: PAGE_LIQUIDITY_PROGRAM },
      { langKey: "TON Footsteps", url: FOOTER_TON_FOOTSTEPS_URL },
      { langKey: "漏洞赏金", url: FOOTER_BUG_BOUNTY_URL },
    ],
  },
  {
    headerLangKey: "社区",
    links: [
      { langKey: "社区", url: PAGE_COMMUNITY },
      { langKey: "TON基金会", url: TON_FOUNDATION_URL },
      { langKey: "活动", url: PAGE_EVENTS },
      { langKey: "合作", url: PAGE_COLLABORATE },
      { langKey: "博客", url: TON_BLOG_URL },
      { langKey: "新闻稿", url: FOOTER_PRESS_RELEASES_URL },
      { langKey: "职业", url: FOOTER_CAREERS_URL },
    ],
  },
  {
    headerLangKey: "其他",
    links: [
      { langKey: "支持和反馈", url: FOOTER_SUPPORT_AND_FEEDBACK },
      { langKey: "品牌资产", url: PAGE_BRAND_ASSETS },
      { langKey: "联系我们", url: PAGE_CONTACT_US },
    ],
  },
];

export function footerLinkExporter(lang?: string) {
  const FOOTER_LINKS_TRANSLATIONS = {
    mandarin: FOOTER_COLUMN_LINKS_CN,
  };

  return (
    FOOTER_LINKS_TRANSLATIONS?.[lang?.toLowerCase()] ?? FOOTER_COLUMN_LINKS_EN
  );
}



================================================
FILE: src/theme/Footer/index.tsx
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/index.tsx
================================================
import React, { FC, useState, useEffect } from "react";
import "./Footer.scss";
import { NetworkIcon } from "./NetworkIcon";
import { Caption, Text } from "./Typography";
import { Logo } from "./Logo";
import { Separator } from "./Separator";
import { FOOTER_COLUMN_LINKS_EN, footerLinkExporter, NETWORKS } from "./config";
import { NewRow, NewCol } from "./GridSystem";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useColorMode } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface IFooterColumnContentProps {
  column: (typeof FOOTER_COLUMN_LINKS_EN)[0];
  scheme?: "dark" | "light";
}

const FooterColumnContent: FC<IFooterColumnContentProps> = ({
  column,
  scheme,
}) => {
  return (
    <>
      <Text className="CustomFooter__colHeader">{column.headerLangKey}</Text>
      <div className="CustomFooter__colLinks">
        {column.links.map((link) => (
          <a
            className="CustomFooter__colLink"
            href={link.url}
            key={link.langKey}
          >
            <Caption scheme={scheme}>{link.langKey}</Caption>
          </a>
        ))}
      </div>
    </>
  );
};

const LINKS_ROW_CONFIG = {
  sizeConfig: {
    mobile: 6,
    tabletS: 2.4,
    tabletM: 2.4,
    desktop: 2.4,
  },
  gutterConfig: {
    mobile: 16,
    tabletS: 16,
    tabletM: 16,
    desktop: 32,
  },
};

function Footer() {
  const { footer } = useThemeConfig();
  const { colorMode } = useColorMode();
  const [style, setStyle] = useState<typeof colorMode>("dark");
  const [FOOTER_COLUMN_LINKS, setFOOTER_COLUMN_LINKS] = useState(
    footerLinkExporter()
  );
  const { siteConfig, i18n } = useDocusaurusContext();

  useEffect(() => {
    setFOOTER_COLUMN_LINKS(footerLinkExporter(i18n.currentLocale));
  }, [i18n.currentLocale]);

  if (!footer) {
    return null;
  }

  useEffect(() => {
    const docColorMode = document.documentElement.getAttribute(
      "data-theme"
    ) as typeof colorMode;

    if (colorMode !== docColorMode) {
      setStyle(docColorMode);
    }
  }, []);

  useEffect(() => {
    setStyle(colorMode);
  }, [colorMode]);

  return (
    <footer
      className={`CustomFooter CustomFooter--m-scheme-${style} bootstrap-wrapper`}
    >
      <div className="container">
        <div className="CustomFooter__links">
          <NewRow
            sizeConfig={LINKS_ROW_CONFIG.sizeConfig}
            gutterConfig={LINKS_ROW_CONFIG.gutterConfig}
          >
            {FOOTER_COLUMN_LINKS.map((column) => (
              <NewCol key={column.headerLangKey}>
                <FooterColumnContent column={column} scheme={style} />
              </NewCol>
            ))}
          </NewRow>
        </div>
        <Separator scheme={style} />
        <div className="CustomFooter__copyrights">
          <Logo scheme={style} />
          <div>
            <div className="CustomFooter__networks">
              {NETWORKS.map((network, index) => (
                <a
                  key={index}
                  href={network.url}
                  className="CustomFooter__network"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <NetworkIcon type={network.type} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



================================================
FILE: src/theme/Footer/styles/_all.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/_all.scss
================================================
@import "base/breakpoints";
@import "base/vars";
@import "utils/media_queries";
@import "utils/mixins";
@import "utils/typography";



================================================
FILE: src/theme/Footer/styles/base/_breakpoints.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/base/_breakpoints.scss
================================================
$grid-breakpoints: (
        xxxs: 0,
        xxs: 320px,
        xs: 414px,
        pre-s: 569px,
        s: 734px,
        m: 834px,
        l: 1024px,
        xl: 1280px,
        xxl: 1440px,
);



================================================
FILE: src/theme/Footer/styles/base/_colors.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/base/_colors.scss
================================================
/* Common colors for all themes */
body {
  --ton_blue: #0098EA;
  --ton_dark_blue: #07ACFF;
  --ton_purple: #B588FF;
  --default_white: #FFFFFF;
  --default_black: #161C28;
  --toncoin_header: #353538;
  --toncoin_gradient: linear-gradient(297.97deg, #232328 9.93%, #343437 76.88%);
}

body,
body[data-theme="light"] {
  /* TODO DELETE - OLD VERSION */

  /* Background */
  --background_light_main: #F7F9FB;
  --background_light_gradient: linear-gradient(180deg, #F7F9FB 0%, rgba(238, 242, 245, 0.8) 116.16%);

  --background_blue_gradient_horizontal: linear-gradient(90.41deg, #458CFE -0.8%, #7DD8FD 126.74%);
  --background_purple_gradient_horizontal: linear-gradient(90.49deg, #767DFF -1.08%, #7CD3FF 110.66%);
  --background_ltblue_gradient_horizontal: linear-gradient(90.41deg, #488FFF -0.8%, #7DEEF5 100.48%);

  --background_blue_gradient_vertical: linear-gradient(157.03deg, #458CFE 9.51%, #7DD8FD 93.49%);
  --background_light_icon: rgba(0, 136, 204, 0.06);
  --background_light_blue: rgba(0, 136, 204, 0.1);

  --background_dark_main: #232328;
  --background_dark_gradient: linear-gradient(0deg, #232328 0%, #343437 101.47%);
  --background_dark_secondary: rgba(255, 255, 255, 0.03);

  --background_gradient_light: linear-gradient(180deg, #FFFFFF 0%, #F7F9FB 134.8%);
  --background_green_light: rgb(130, 154, 148);
  --background_black_mini_opacity: rgb(0, 0, 0, 0.24);

  --background_loading_gradient_light: linear-gradient(90deg, #F7F9FB -9.69%, #F2F5F8 -9.68%, #FFFFFF 52.19%, #F2F5F8 106.56%);
  --background_button_loading_light: linear-gradient(89.96deg, rgba(255, 255, 255, 0.1) 0.04%, rgba(255, 255, 255, 0.32) 50.98%, rgba(255, 255, 255, 0.1) 99.96%);

  --background_white_shadow_light: linear-gradient(0, var(--background_light_main) 30%, rgba(247, 249, 251, 0) 100%);

  /* Button */
  --button_light_primary: #0098EA;
  --button_light_primary_hover: #00A6FF;
  --button_light_primary_pressed: #0082C2;

  --button_light_secondary: rgba(246, 248, 251, 0.8);
  --button_light_secondary_hover: #F4F7FA;
  --button_light_secondary_pressed: #F4F7FA;

  --button_dark_primary: #07ACFF;
  --button_dark_primary_hover: #00A1F1;
  --button_dark_primary_pressed: #076C9F;

  --button_dark_secondary: rgba(255, 255, 255, 0.06);
  --button_dark_secondary_hover: rgba(255, 255, 255, 0.12);
  --button_dark_secondary_pressed: rgba(255, 255, 255, 0.03);

  --button_dark_text: #07ACFF;
  --button_dark_secondary_text_hover: #5BC8FF;
  --button_dark_secondary_text_pressed: #0186C9;

  --button_light_primary_small: rgba(0, 136, 204, 0.06);
  --button_light_primary_small_hover: rgba(0, 136, 204, 0.30);
  --button_light_primary_small_pressed: rgba(0, 136, 204, 0.03);

  /* Text */
  --text_light_primary: #161C28;
  --text_light_secondary: #728A96;

  --text_dark_primary: #FFFFFF;
  --text_dark_secondary: rgba(255, 255, 255, 0.7);
  --text_dark_gradient: linear-gradient(89.92deg, #06A1EF 28.51%, #69CDFF 85.79%);

  /* Icon */
  --icon_light_primary: #0098EA;
  --icon_light_secondary: rgba(236, 240, 243, 0.8);
  --icon_light_thirdly: #98B2BF;

  --icon_dark_primary: #02A8FB;

  /* Separator */
  --separator_light: rgba(123, 148, 160, 0.2);
  --separator_dark: rgba(255, 255, 255, 0.06);

  --black: #000000;

  --covers_light_green: #CAEFD9;


  /* Links */

  --hovered_link: #0098EA;

  --light_border: rgba(114, 138, 150, 0.24);
  /* TODO DELETE - OLD VERSION */


  /* Accent */
  --accent-light-default: #0098EA;
  --accent-dark-default: #07ACFF;

  --accent-light-hover: #00A6FF;
  --accent-dark-hover: #34BCFF;


  /* Background */

  --background-light-page: #FFFFFF;
  --background-dark-page: #232328;

  --background-light-content: #F7F9FB;
  --background-dark-content: #2D2D32;

  --background-light-content-hover: #F2F5F8;
  --background-dark-content-hover: #37373C;

  /* Text */
  /* Icon */
  /* Segment control */
  /* Card border */
  /* Separator */
  /* Gradient */
  /* Basic */
  /* Feedback colors */

}

body[data-theme="dark"] {
}

/* New color system (redesign) */

body {
  --accent-light: #0098EA;
  --accent-dark: #07ACFF;
  --accent-hover-light: #00A6FF;
  --accent-hover-dark: #34BCFF;

  --background-page-light: #FFFFFF;
  --background-page-dark: #232328;
  --background-page-hover-light: #F7F9FB;
  --background-page-hover-dark: #2D2D32;

  --background-content-light: #F7F9FB;
  --background-content-dark: #2D2D32;
  --background-content-hover-light: #F0F4F8;
  --background-content-hover-dark: #36363C;

  --text-primary-light: #04060B;
  --text-primary-dark: #F3F3F6;
  --text-secondary-light: #191F2F;
  --text-secondary-dark: #D5D5D8;
  --text-tertiary-light: #728A96;
  --text-tertiary-dark: #ACACAF;

  --icon-primary-light: #232328;
  --icon-primary-dark: #E5E5EA;
  --icon-secondary-light: #98B2BF;
  --icon-secondary-dark: #606069;
  --icon-tertiary-light: #C0D1D9;
  --icon-tertiary-dark: #45454B;

  --button-primary-light: var(--accent-light);
  --button-primary-dark: var(--accent-light);
  --button-primary-text-light: var(--accent-light);
  --button-primary-text-dark: var(--accent-dark);
  --button-secondary-stroke-light: #E9EEF1;
  --button-secondary-stroke-dark: #303035;

  --segment-background-light: #F2F5F8;
  --segment-background-dark: #232328;
  --segment-active-light: #FFFFFF;
  --segment-active-dark: #2D2D32;
  --segment-active-content-dark: #3F3F46;

  --card-border-light: #DDE3E6;
  --card-border-dark: #44444A;

  --separator-alpha-light: #DFE5E8;
  --separator-alpha-dark: #4F4F53;

  --gradient-text: linear-gradient(68deg, #2B82EB 0.63%, #1AC8FF 90%);
  --gradient-text-mobile: linear-gradient(68deg, #2B82EB 0.63%, #1AC8FF 50%);
  --gradient-purple: linear-gradient(182.79deg, #9A98F2 -28.73%, #8AC0FF 133.77%);
  --gradient-green: linear-gradient(186.6deg, #7BAEFF -13.27%, #C1EDD1 128.74%);
  --gradient-light-blue: linear-gradient(88.93deg, #2B83EC 18.91%, #1AC9FF 79.91%);
  --gradient-splash: linear-gradient(
    to top left, 
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, 0.0) 45%,
    rgba(255, 255, 255, 0.72) 50%,
    rgba(255, 255, 255, 0.0) 57%,
    rgba(255, 255, 255, 0.0) 100%
  );

  --basic-white: #FFFFFF;
  --basic-white-overlay: rgba(255, 255, 255, 0.70);
  --basic-white-overlay-86: rgba(255, 255, 255, 0.86);
  --basic-white-overlay-50: rgba(255, 255, 255, 0.50);
  --basic-black: #000000;
  --basic-overlay-24: rgba(0, 0, 0, 0.24);
  --basic-overlay-48: rgba(0, 0, 0, 0.70);
  --basic-dark-overlay-86: rgba(0, 0, 0, 0.70);

  --dark-shimmer-card: linear-gradient(90deg, rgba(45, 45, 50, 0.80) 0%, #3F3F47 48.16%, #2D2D32 98.44%);
  --light-shimmer-card: linear-gradient(90deg, #F5F7FA 0%, #FAFDFF 50.98%, #F5F7FA 100%);

  --feedback-error-light: #ED6767;
  --feedback-error-dark: #FF5C5C;
  --feedback-success-light: #47C58A;
  --feedback-success-dark: #32D583;

  --header-item-hover: rgba(118, 152, 187, 0.06);

  --card-hover-box-shadow: 0px 2px 24px rgba(114, 138, 150, 0.12);
  --card-box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  --ligth-green: rgba(255, 92, 92, 0.08);
  --ligth-red: rgba(71, 197, 138, 0.1);

  --dark-selection: rgba(1, 164, 245, 0.1);
  --light-selection: rgba(0, 136, 204, 0.1);

  --basic-white-hover: #F1F4F7;

  --float-shadow-color: #00000014;
}



================================================
FILE: src/theme/Footer/styles/base/_vars.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/base/_vars.scss
================================================
$grid-columns-count: 12;

$def-trans-duration: .3s;
$transition-duration: .2s;
$transition-timing-function: ease-in-out;
$transition-duration-fast: .1s;

$header-height: 114px;
$header-height-xl: 114px;
$header-height-l: 70px;
$header-height-m: 70px;
$header-height-s: 70px;

$header-height-desktop: 68px;
$header-height-mobile: 56px;

$header-fixed-height: 78px;

$container-horizontal-padding: 40px;
$container-horizontal-padding-s: 32px;

$containerMaxWidthTabletM: 936px;
$containerMaxWidthDesktop: 1120px;

// В макете главной в самой маленькой версии 16px, но лучше использовать 24px,
// так как 16 очень мало и на всех остальных страницах для мобилки используется 24px
$container-horizontal-padding-xs: 24px;

$opacity-s: .2;
$opacity-half: 0.56;

$svg-link-filter: invert(71%) sepia(20%) saturate(288%) hue-rotate(155deg) brightness(94%) contrast(90%);
$svg-hover-link-filter: invert(34%) sepia(83%) saturate(1078%) hue-rotate(170deg) brightness(101%) contrast(104%);

$svg-tab-filter: invert(19%) sepia(1%) saturate(0%) hue-rotate(90deg) brightness(85%) contrast(91%);

$container-horizontal-paddings-mobile: 32px;
$container-horizontal-paddings-tablet-s: 80px;

/* Z-INDEX */
$base: 0;
$above: 1;
$below: -1;

$overlapping: $above + $base;
$main: $above + $overlapping;
$covering: $above + $main;
$drawer: $above + $covering;
$fixed: $above + $drawer;
$modal: $above + $fixed;
$modal-tooltip: $above + $modal;

//PADDINGS

$card-l-padding-vertical: 40px;
$card-l-padding-horizontal: 48px;
$card-l-padding: $card-l-padding-vertical $card-l-padding-horizontal;

$card-m-padding-vertical: 28px;
$card-m-padding-horizontal: 32px;
$card-m-padding: $card-m-padding-vertical $card-m-padding-horizontal;

$card-s-padding-vertical: 20px;
$card-s-padding-horizontal: 24px;
$card-s-padding: $card-s-padding-vertical $card-s-padding-horizontal;


//height and width

$card-l-width: 496px;
$card-l-height: 310px;

$card-s-width: 295px;
$card-s-height: 285px;

$card-xs-height: 232px;

//border
$border-r-md: 24px;
$border-r-sm: 16px;
$border-r-xs: 12px;

$button-border-width: 1.5px;


================================================
FILE: src/theme/Footer/styles/utils/_media_queries.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/utils/_media_queries.scss
================================================
@use "sass:map";
@import "../base/breakpoints";

// less than 360px
@mixin media-breakpoint-custom-mobile {
  @media (max-width: 359px) {
    @content;
  }
}

// less than 414px
@mixin media-breakpoint-xs {
  @media (max-width: #{map.get($grid-breakpoints, "xs")}) {
    @content;
  }
}

// less than 569px
@mixin media-breakpoint-pre-s {
  @media (max-width: #{map.get($grid-breakpoints, "pre-s")}) {
    @content;
  }
}

// less than 734px
@mixin media-breakpoint-s {
  @media (max-width: #{map.get($grid-breakpoints, "s")}) {
    @content;
  }
}

// less than 834px
@mixin media-breakpoint-m {
  @media (max-width: #{map.get($grid-breakpoints, "m")}) {
    @content;
  }
}

// less than 1024px
@mixin media-breakpoint-l {
  @media (max-width: #{map.get($grid-breakpoints, "l")}) {
    @content;
  }
}

// less than 1280px
@mixin media-breakpoint-xl {
  @media (max-width: #{map.get($grid-breakpoints, "xl")}) {
    @content;
  }
}

// less than 1440px
@mixin media-breakpoint-xxl {
  @media (max-width: #{map.get($grid-breakpoints, "xxl")}) {
    @content;
  }
}


// more than 0px

@mixin media-breakpoint-mobile {
  @media (min-width: #{map.get($grid-breakpoints, "xxxs")}) {
    @content;
  }
}

// more than 734px

@mixin media-breakpoint-tablet-s {
  @media (min-width: #{map.get($grid-breakpoints, "s")}) {
    @content;
  }
}

// more than 1024px

@mixin media-breakpoint-tablet-m {
  @media (min-width: #{map.get($grid-breakpoints, "l")}) {
    @content;
  }
}

// more than 1280px

@mixin media-breakpoint-desktop {
  @media (min-width: #{map.get($grid-breakpoints, "xl")}) {
    @content;
  }
}

// more than 1440px

@mixin media-breakpoint-desktop-large {
  @media (min-width: #{map.get($grid-breakpoints, "xxl")}) {
    @content;
  }
}

/* only Safari 10.1+ */

@mixin media-only-safari($selector) {
  _::-webkit-full-page-media, _:future, :root #{$selector} {
    @content;
  }
}




================================================
FILE: src/theme/Footer/styles/utils/_mixins.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/utils/_mixins.scss
================================================
@import "media_queries";
@import "typography";
@import "../base/vars";


@mixin untilMedia($display-width: 1000) {
  @media (max-width: calc(#{$display-width} * 1px)) {
    @content;
  }
}

@mixin upMedia($display-width: 1000) {
  @media (min-width: calc(#{$display-width} * 1px)) {
    @content;
  }
}

@mixin hover-state($withCustomTransition: false, $cursor: true) {
  @if not $withCustomTransition {
    @include with-transition(color, background-color, opacity);
  }
  cursor: pointer;

  @if not $cursor {
    cursor: default;
  }

  @media screen and (min-width: 1000px) {
    @content;
  }
}

@mixin text-ellipsis($max-width: 100%) {
  overflow: hidden;
  max-width: $max-width;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin text-ellipsis-multiline($lines-count: 3) {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: $lines-count;
  -webkit-box-orient: vertical;
}

@mixin property-with-safe-area($property, $value, $part) {
  #{$property}: $value;

  @supports ($property: constant(safe-area-inset-#{$part})) {
    #{$property}: calc(#{$value} + constant(safe-area-inset-#{$part}));
  }

  @supports ($property: env(safe-area-inset-#{$part})) {
    #{$property}: calc(#{$value} + env(safe-area-inset-#{$part}));
  }
}

@mixin property-subtract-ios-address-bar($property, $value) {
  #{$property}: $value;
  @supports (-webkit-touch-callout: none) {
    #{$property}: calc(#{$value} - 80px);
  }
}

@mixin with-transition($prop, $prop2: false, $prop3: false) {
  @if $prop3 {
    transition: $prop $transition-duration $transition-timing-function, $prop2 $transition-duration $transition-timing-function, $prop3 $transition-duration $transition-timing-function;
  } @else if $prop2 {
    transition: $prop $transition-duration $transition-timing-function, $prop2 $transition-duration $transition-timing-function;
  } @else {
    transition: $prop $transition-duration $transition-timing-function;
  }
}

@mixin with-transition-default-f($prop, $prop2: false, $prop3: false) {
  @if $prop3 {
    transition: $prop $transition-duration $transition-timing-function, $prop2 $transition-duration $transition-timing-function, $prop3 $transition-duration;
  } @else if $prop2 {
    transition: $prop $transition-duration $transition-timing-function, $prop2 $transition-duration;
  } @else {
    transition: $prop $transition-duration;
  }
}

@mixin placeholder-color() {
  &::-moz-placeholder {
    @content;
  }
  &::-webkit-input-placeholder {
    @content;
  }
  &:-ms-input-placeholder {
    @content;
  }
  &::-ms-input-placeholder {
    @content;
  }
  &::placeholder {
    @content;
  }
}

@mixin overlay-border($border-color, $border-radius: 20px, $isHalfOfPixel: true) {
  position: relative;

  &:before {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    transform-origin: top left;
    border: 1px solid $border-color;
    border-radius: $border-radius;

    @if $isHalfOfPixel {
      @media (min-resolution: 2dppx) {
        width: 200%;
        height: 200%;
        border-radius: $border-radius * 2;
        transform: scale(0.5);
      }
    }
  }
}

@mixin background-large-blur {
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}

@mixin loading($time: 3s, $background: var(--background_loading_gradient_light)) {
  background-image: none;
  transform: translateZ(0);
  background: $background;
  animation: $time linear infinite alternate shine-lines;
}

@keyframes shine-lines {
  0% {
    background-position: -400px
  }

  100% {
    background-position: 440px
  }
}

@keyframes inAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@mixin white-block-hover {
  opacity: 0.72;
  background-color: var(--basic-white-hover);
}

@mixin fade_in_animation($animation-duration: 0.3s) {
  transition: opacity $animation-duration ease-in-out;
}

@mixin custom-scrollbar($margin-bottom: 0) {
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    margin-bottom: $margin-bottom;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--icon-tertiary-light);
    border-radius: 100px;
  }
}

@mixin hide-scrollbar() {
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@mixin blurFilter ($length: 3px) {
  backdrop-filter: blur($length);
}

@mixin background-blur {
  @include blurFilter(16px);
}

@keyframes shineAnimation {
  to {
    background-position: 200% 0, center;
  }
}

@mixin column-flex-gap-s($desktopGap: 0, $mobileGap: false) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $desktopGap;
  
  @if $mobileGap {
      @include media-breakpoint-s {
          gap: $mobileGap;
      }
  }
}


================================================
FILE: src/theme/Footer/styles/utils/_typography.scss
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/Footer/styles/utils/_typography.scss
================================================
@import "media_queries";

$font-weight-black: 900;
$font-weight-extra-bold: 800;
$font-weight-bold: 700;
$font-weight-semi-bold: 600;
$font-weight-medium: 500;
$font-weight-regular: 400;
$font-weight-light: 300;
$font-weight-extra-light: 200;
$font-weight-thin: 100;

$ultra-font-size-mobile: 32px;
$ultra-font-size-tablet-s: 64px;
$ultra-font-size-desktop: 80px;

$ultra-line-height-mobile: 40px;
$ultra-line-height-tablet-s: 72px;
$ultra-line-height-desktop: 92px;

$extra-font-size-mobile: 56px;
$extra-font-size-tablet-s: 64px;
$extra-font-size-desktop: 80px;

$extra-line-height-mobile: 64px;
$extra-line-height-tablet-s: 72px;
$extra-line-height-desktop: 92px;

$h1-font-size-mobile: 36px;
$h1-font-size-tablet-s: 44px;
$h1-font-size-desktop: 64px;

$h1-line-height-mobile: 44px;
$h1-line-height-tablet-s: 56px;
$h1-line-height-desktop: 72px;

$h2-font-size-mobile: 28px;
$h2-font-size-tablet-s: 36px;
$h2-font-size-desktop: 56px;

$h2-line-height-mobile: 36px;
$h2-line-height-tablet-s: 44px;
$h2-line-height-desktop: 64px;

$h3-font-size-mobile: 26px;
$h3-font-size-tablet-s: 32px;
$h3-font-size-desktop: 48px;

$h3-line-height-mobile: 32px;
$h3-line-height-tablet-s: 40px;
$h3-line-height-desktop: 56px;

$h4-font-size-mobile: 26px;
$h4-font-size-tablet-s: 26px;
$h4-font-size-desktop: 40px;

$h4-line-height-mobile: 32px;
$h4-line-height-tablet-s: 32px;
$h4-line-height-desktop: 48px;

$h5-font-size-mobile: 20px;
$h5-font-size-tablet-s: 20px;
$h5-font-size-desktop: 32px;

$h5-line-height-mobile: 28px;
$h5-line-height-tablet-s: 28px;
$h5-line-height-desktop: 40px;

$headline-1-font-size-mobile: 20px;
$headline-1-font-size-desktop: 24px;

$headline-1-line-height-mobile: 28px;
$headline-1-line-height-desktop: 32px;

$headline-2-font-size-mobile: 18px;
$headline-2-font-size-desktop: 20px;

$headline-2-line-height-mobile: 22px;
$headline-2-line-height-desktop: 30px;


$button-1-font-size-mobile: 14px;
$button-1-font-size-tablet-s: 16px;

$button-1-line-height-mobile: 24px;
$button-1-line-height-tablet-s: 24px;

$button-2-font-size-mobile: 14px;
$button-2-font-size-tablet-s: 16px;

$button-2-line-height: 24px;

$button-3-font-size-mobile: 12px;
$button-3-font-size-tablet-s: 14px;

$button-3-line-height: 18px;

$text-1-font-size-mobile: 16px;
$text-1-font-size-desktop: 18px;

$text-1-line-height-mobile: 24px;
$text-1-line-height-desktop: 28px;


$text-2-font-size-mobile: 14px;
$text-2-font-size-desktop: 16px;

$text-2-line-height-mobile: 20px;
$text-2-line-height-desktop: 24px;

$caption-font-size-mobile: 12px;
$caption-font-size-desktop: 14px;

$caption-line-height-mobile: 16px;
$caption-line-height: 20px;

$font-size-large-xl: 72px;
$font-size-large-pre-xl: 64px;
$font-size-large-l: 56px;
$font-size-large-m: 48px;
$font-size-large-pre-m: 42px;
$font-size-large-s: 40px;
$font-size-large-xs: 36px;

$font-size-md-xl: 34px;
$font-size-md-l: 32px;
$font-size-md-m: 28px;
$font-size-md-s: 24px;

$font-size-small-xl: 20px;
$font-size-small-l: 18px;
$font-size-small-m: 16px;
$font-size-small-pre-m: 15px;
$font-size-small-s: 14px;
$font-size-small-xs: 12px;
$font-size-small-xxs: 10px;


$line-height-large-xl: 88px;
$line-height-large-pre-xl: 72px;
$line-height-large-l: 64px;
$line-height-large-m: 56px;
$line-height-large-s: 48px;
$line-height-large-xs: 44px;

$line-height-medium-xl: 40px;
$line-height-medium-l: 38px;
$line-height-medium-m: 36px;
$line-height-medium-s: 32px;
$line-height-medium-xs: 30px;

$line-height-small-xl: 28px;
$line-height-small-l: 24px;
$line-height-small-m: 22px;
$line-height-small-s: 18px;
$line-height-small-xs: 14px;

@mixin font-inter {
  font-family: "Inter", -apple-system, BlinkMacSystemFont,
  Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

@mixin font-jet-brains-mono {
  font-family: "JetBrains Mono", -apple-system, BlinkMacSystemFont,
  Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

@mixin text-1 {
  font-size: $text-1-font-size-desktop;
  line-height: $text-1-line-height-desktop;

  @include media-breakpoint-s {
    font-size: $text-1-font-size-mobile;
    line-height: $text-1-line-height-mobile;
  }
}


================================================
FILE: src/theme/prism-include-languages.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism-include-languages.js
================================================
import siteConfig from '@generated/docusaurus.config';
export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: {prism},
  } = siteConfig;
  const {additionalLanguages} = prism;
  // Prism components work on the Prism instance on the window, while prism-
  // react-renderer uses its own Prism instance. We temporarily mount the
  // instance onto window, import components to enhance it, then remove it to
  // avoid polluting global namespace.
  // You can mutate PrismObject: registering plugins, deleting languages... As
  // long as you don't re-assign it
  globalThis.Prism = PrismObject;
  additionalLanguages.forEach((lang) => {
    require(`prismjs/components/prism-${lang}`);
  });

  require('./prism/prism-fift');
  require('./prism/prism-func');
  require('./prism/prism-tolk');
  require('./prism/prism-tlb');
  require('./prism/prism-tact');

  delete globalThis.Prism;
}



================================================
FILE: src/theme/prism/prism-fift.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism/prism-fift.js
================================================
Prism.languages.fift = {
  'symbol': [
    /[xX]\{[0-9a-fA-F_]*\}/,
    /[bB]\{[01]*\}/,
    /'\S+/,
  ],
  'string': /"([^"\r\n\\]|\\.)*"/,

  'comment': [
    {
      pattern: /\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
      greedy: true,
    },
    {
      pattern: /\/\/.*/,
      lookbehind: true,
      greedy: true,
    },
  ],

  'operator': [
    // Full list can be found in
    // Appendix A. List of Fift words
    // Ordered the same way source code does this.
    // Except: shorter words must follow
    // longer ones with the same base part.
    // Example: `#` comes after `#s`
    /#>/, /#s/, /\$#/, /#/,

    /\$\+/, /\$,/, /\$\d/, /\$=/, /\$(?=\()/,
    /\$>smca/, /\$>s/,
    /\$@\+/, /\$@\?\+/, /\$@\?/, /\$@/,
    /\$cmp/, /\$len/, /\$pos/, /\$reverse/,

    /%1<</,

    /\('\)/, /\(-trailing\)/, /\(\.\)/, /\(atom\)/, /\(b\.\)/,
    /\(compile\)/, /\(create\)/, /\(def\?\)/, /\(dump\)/, /\(execute\)/,
    /\(forget\)/, /\(number\)/, /\(x\.\)/, /\(\{\)/, /\(\}\)/,

    /\*\/cmod/, /\*\/c/, /\*\/mod/, /\*\/rmod/, /\*\/r/, /\*\//,
    /\*>>c/, /\*>>r/, /\*>>/, /\*mod/, /\*/,

    /\+!/, /\+/, /,/, /-!/, /-/, /!/,
    /-1<</, /\._/, /\.dump/, /\.l/, /\.sl/, /\.s/, /\.tc/,
    /\//, /\/\*/, /\/cmod/, /\/c/, /\/mod/, /\/rmod/, /\/r/,
    /0!/, /0<=/, /0<>/, /0</, /0=/, /0>=/, /0>/,
    /1\+!/, /1\+/, /1-!/, /1-/, /1<</, /1<<1-/,
    /2\*/, /2\+/, /2-/, /2\//, /2=:/,

    /::_/, /::/, /:_/, /=:/, /:/,

    /<#/, /<<\/c/, /<<\/r/, /<=/, /<>/, /<b/, /<s/, /<<\//,
    /<</, /</, /=/,

    />=/, />>c/, />>r/, />>/, />/,

    /\?dup/,

    /@'/, /@/,

    /B\+/, /B,/, /B=/, /B>Li@\+/, /B>Li@/, /B>Lu@\+/, /B>Lu@/, /B>boc/,
    /B>file/, /B>i@\+/, /B>i@/, /B>u@\+/, /B>u@/,
    /B@\?\+/, /B@\+/, /B@\?/, /B@/,
    /Bcmp/, /BhashB/, /Bhashu/, /Bhash/, /Blen/, /Bx\./,
    /B\|/, /Li>B/, /Lu>B/,

    /\[\]/, /\[compile\]/, /\[/, /\]/,

    /atom\?/,

    /b\+/, /b\._/, /b\./,
    /b>idict!\+/, /b>idict!/, /b>sdict!\+/, /b>sdict!/,
    /b>udict!\+/, /b>udict!/,
    /b>/, /boc\+>B/, /boc>B/,

    /csr\./,
    /def\?/,
    /empty\?/, /eq\?/,
    /file-exists\?/, /file>B/,

    /i,/, /i>B/, /i@\+/, /i@\?\+/, /i@\?/, /i@/,
    /idict!\+/, /idict!/, /idict-/, /idict@-/, /idict@/,

    /null!/, /null\?/,
    /pfxdict!\+/, /pfxdict!/, /pfxdict@/, /priv>pub/,
    /ref@\+/, /ref@/, /ref@\?\+/, /ref@\?/,

    /s,/, /s>c/, /s>/,
    /sdict!\+/, /sdict!/, /sdict-/, /sdict@-/, /sdict@/,
    /smca>\$/, /sr,/,

    /tuple\?/,

    /u,/, /u>B/, /u@\+/, /u@\?\+/, /u@\?/,
    /udict!\+/, /udict!/, /udict-/, /udict@-/, /udict@/,
    /undef\?/,

    /x\._/, /x\./,

    /\|\+/, /\|/, /\|_/,

    /\?\./, /'/,

    // Should be the last:
    /\./,
  ],

  'keyword': /\b(?:-roll|-rot|-trailing|-trailing0|2constant|2drop|2dup|2over|2swap|abort|abs|allot|and|anon|atom|bbitrefs|bbits|bl|box|brefs|brembitrefs|brembits|bremrefs|bye|caddr|cadr|car|cddr|cdr|char|chr|cmp|cond|cons|constant|count|cr|create|depth|dictmap|dictmerge|dictnew|does|drop|dup|ed25519_chksign|ed25519_sign|ed25519_sign_uint|emit|exch|exch2|execute|explode|find|first|fits|forget|gasrunvm|gasrunvmcode|gasrunvmctx|gasrunvmdict|halt|hash|hashB|hashu|hold|hole|if|ifnot|include|list|max|min|minmax|mod|negate|newkeypair|nil|nip|nop|not|now|null|or|over|pair|pick|quit|remaining|reverse|roll|rot|runvm|runvmcode|runvmctx|runvmdict|sbitrefs|sbits|second|sgn|shash|sign|single|skipspc|space|srefs|swap|ten|third|times|triple|tuck|tuple|type|ufits|uncons|unpair|unsingle|until|untriple|untuple|variable|while|word|words|xor)\b/,
  'boolean': /\b(?:false|true)\b/,

  'number': [
    /(0[xX][0-9a-fA-F]+)/,
    /(0[bB][01]+)/,
    /(-?\d+(\/-?\d+)?)/,
  ],
  'variable': /[\w$-]+/,

  'punctuation': /[\[\{\}\],\(\)]/,
};


================================================
FILE: src/theme/prism/prism-func.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism/prism-func.js
================================================
/**
 * @file Prism.js definition for FunC
 * @link https://docs.ton.org/develop/func/overview
 * @version 0.4.4
 * @author Novus Nota (https://github.com/novusnota)
 * @author Nikita Sobolev (https://github.com/sobolevn)
 * @license MIT
 */
(function(Prism) {
  /** @type {Prism.GrammarValue} */
  var number = /-?\b(?:\d+|0x[\da-fA-F]+)\b(?![^\.~,;\[\]\(\)\s])/;

  /** @type {Prism.GrammarValue} */
  var string = [
    { // multi-line
      pattern: /"""[\s\S]*?"""[Hhcusa]?/,
      greedy: true,
      inside: {
        // string type
        'symbol': {
          pattern: /("""[\s\S]*?""")[Hhcusa]/,
          lookbehind: true,
          greedy: true,
        }
      },
    },
    { // single-line
      pattern: /"[^\n"]*"[Hhcusa]?/,
      greedy: true,
      inside: {
        // string type
        'symbol': {
          pattern: /("[^\n"]*")[Hhcusa]/,
          lookbehind: true,
          greedy: true,
        }
      },
    },
  ];

  /** @type {Prism.GrammarValue} */
  var operator = /(?:!=|\?|:|%=|%|&=|&|\*=|\*|\+=|\+|->|-=|-|\/%|\/=|\/|<=>|<<=|<<|<=|<|==|=|>>=|>>|>=|>|\^>>=|\^>>|\^=|\^\/=|\^\/|\^%=|\^%|\^|\|=|\||~>>=|~>>|~\/=|~\/|~%|~)(?=\s)/;

  /** @type {RegExp[]} */
  var var_identifier = [
    // quoted
    /`[^`\n]+`/,
    // plain
    /[^\.~,;\[\]\(\)\s]+/
  ];

  /** Prism.js definition for FunC */
  Prism.languages.func = {
    'comment': [
      { // single-line
        pattern: /;;.*/,
        lookbehind: true,
        greedy: true,
      },
      { // multi-line, not nested (TODO: nesting)
        // . isn't used, because it only applies to the single line
        pattern: /\{-[\s\S]*?(?:-\}|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        // unused variable identifier
        pattern: /\b_\b(?![^\.~,;\[\]\(\)\s])/
      },
    ],

    // Custom token for #pragma's
    'pragma': {
      pattern: /#pragma(.*);/,
      inside: {
        'keyword': /(?:#pragma|test-version-set|not-version|version|allow-post-modification|compute-asm-ltr)\b/,
        'number': /(?:\d+)(?:.\d+)?(?:.\d+)?/,
        'operator': /=|\^|<=|>=|<|>/,
        'string': string,
        'punctuation': /;/,
      }
    },

    // Custom token for #include's
    'include': {
      pattern: /#include(.*);/,
      inside: {
        'keyword': /#include\b/,
        'string': string,
        'punctuation': /;/,
      }
    },

    // builtin types
    'builtin': /\b(?:int|cell|slice|builder|cont|tuple|type)\b/,

    // builtin constants
    'boolean': /\b(?:false|true|nil|Nil)\b/,

    'keyword': /\b(?:forall|extern|global|asm|impure|inline_ref|inline|auto_apply|method_id|operator|infixl|infixr|infix|const|return|var|repeat|do|while|until|try|catch|ifnot|if|then|elseifnot|elseif|else)\b/,

    'number': number,

    'string': string,

    'operator': operator,

    'punctuation': [/[\.,;\(\)\[\]]/, /[\{\}](?![^\.~,;\[\]\(\)\s])/],

    // Function and method names in declarations, definitions and calls
    'function': [
      { // quoted
        pattern: new RegExp(var_identifier[0].source + /(?=\s*\()/.source),
        greedy: true,
      },
      { // bitwise not operator
        pattern: /~_/,
        greedy: true,
      },
      { // remaining operators
        pattern: new RegExp(/\^?_/.source + operator.source + /_/.source),
        greedy: true,
      },
      { // plain function or method name
        pattern: new RegExp(/[\.~]?/.source + var_identifier[1].source + /(?=\s*\()/.source),
        greedy: true,
      },
      { // builtin functions and methods
        pattern: /\b(?:divmod|moddiv|muldiv|muldivr|muldivc|muldivmod|null\?|throw|throw_if|throw_unless|throw_arg|throw_arg_if|throw_arg_unless|load_int|load_uint|preload_int|preload_uint|store_int|store_uint|load_bits|preload_bits|int_at|cell_at|slice_at|tuple_at|at|touch|touch2|run_method0|run_method1|run_method2|run_method3|~divmod|~moddiv|~store_int|~store_uint|~touch|~touch2|~dump|~stdump)\b/,
        greedy: true,
      },
    ],

    // Parametric polymorphism
    'class-name': /[A-Z][^\.~,;\[\]\(\)\s]*/,

    // All the rest of identifiers
    'variable': var_identifier.map(x => { return { pattern: x, greedy: true } }),
  };

  // Adding a fc alias
  Prism.languages.fc = Prism.languages.func;
}(Prism));



================================================
FILE: src/theme/prism/prism-tact.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism/prism-tact.js
================================================
/**
 * @file Prism.js definition for Tact
 * @link https://tact-lang.org
 * @version 1.5.0
 * @author Novus Nota (https://github.com/novusnota)
 * @license MIT
 */
(function(Prism) {
  Prism.languages.tact = {
    // reserved keywords
    'keyword': [
      {
        pattern: /\b(?:abstract|asm|as|catch|const|contract(?!:)|do|else|extend|extends|foreach|fun|get|if|in|import|initOf|inline|let|message(?!:)|mutates|native|override|primitive|public|repeat|return|self|struct(?!:)|trait(?!:)|try|until|virtual|while|with)\b/,
      },
      { // reserved function names
        pattern: /\b(?:bounced|external|init|receive)\b(?=\()/
      },
    ],

    // built-in types
    'builtin': [
      {
        pattern: /\b(?:Address|Bool|Builder|Cell|Int|Slice|String|StringBuilder)\b/,
      },
      { // keyword after as, see: https://prismjs.com/extending.html#object-notation
        pattern: /(\bas\s+)(?:coins|remaining|bytes32|bytes64|int257|u?int(?:2[0-5][0-6]|1[0-9][0-9]|[1-9][0-9]?))\b/,
        lookbehind: true,
        greedy: true,
      },
    ],

    // SCREAMING_SNAKE_CASE for null values and names of constants
    'constant': [
      {
        pattern: /\bnull\b/,
      },
      {
        pattern: /\b[A-Z][A-Z0-9_]*\b/,
      },
    ],

    // UpperCamelCase for names of contracts, traits, structs, messages
    'class-name': {
      pattern: /\b[A-Z]\w*\b/,
    },

    // mappings to FunC
    'attribute': [
      { // functions
        pattern: /@name/,
        inside: {
          'function': /.+/,
        },
      },
      { // contract interfaces
        pattern: /@interface/,
        inside: {
          'function': /.+/,
        }
      }
    ],

    'function': {
      pattern: /\b\w+(?=\()/,
    },

    'boolean': {
      pattern: /\b(?:false|true)\b/,
    },

    'number': [
      { // hexadecimal, case-insensitive /i
        pattern: /\b0x[0-9a-f](?:_?[0-9a-f])*\b/i,
      },
      { // octal, case-insensitive /i
        pattern: /\b0o[0-7](?:_?[0-7])*\b/i,
      },
      { // binary, case-insensitive /i
        pattern: /\b0b[01](?:_?[01])*\b/i,
      },
      { // decimal integers, starting with 0
        pattern: /\b0\d*\b/,
      },
      { // other decimal integers
        pattern: /\b[1-9](?:_?\d)*\b/,
      },
    ],

    'string': undefined,

    'punctuation': {
      pattern: /[{}[\]();,.:?]/,
    },

    'comment': [
      { // single-line
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
      { // multi-line
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        // unused variable identifier
        pattern: /\b_\b/
      }
    ],

    'operator': {
      'pattern': /![!=]?|->|[+\-*/%=]=?|[<>]=|<<?|>>?|~|\|[\|=]?|&[&=]?|\^=?/,
    },

    'variable': {
      'pattern': /\b[a-zA-Z_]\w*\b/,
    },

  };

  // strings, made this way to not collide with other entities
  Prism.languages.insertBefore('tact', 'string', {
    'string-literal': {
      pattern: /(?:(")(?:\\.|(?!\1)[^\\\r\n])*\1(?!\1))/,
      greedy: true,
      inside: {
        'regex': [
          { // \\ \" \n \r \t \v \b \f
            pattern: /\\[\\"nrtvbf]/,
          },
          { // hexEscape, \x00 through \xFF
            pattern: /\\x[0-9a-fA-F]{2}/,
          },
          { // unicodeEscape, \u0000 through \uFFFF
            pattern: /\\u[0-9a-fA-F]{4}/,
          },
          { // unicodeCodePoint, \u{0} through \u{FFFFFF}
            pattern: /\\u\{[0-9a-fA-F]{1,6}\}/,
          },
        ],
        'string': {
          pattern: /[\s\S]+/,
        },
      },
    },
  });

  // map and bounced message generic type modifiers
  Prism.languages.insertBefore('tact', 'keyword', {
    'generics': {
      pattern: /(?:\b(?:bounced|map)\b<[^\\\r\n]*>)/,
      greedy: true,
      inside: {
        'builtin': [
          ...Prism.languages['tact']['builtin'],
          {
            pattern: /\b(?:bounced(?=<)|map(?=<))\b/
          },
        ],
        'class-name': Prism.languages['tact']['class-name'],
        'punctuation': {
          pattern: /[<>(),.?]/,
        },
        'keyword': {
          pattern: /\bas\b/,
        },
      },
    },
  });
}(Prism));



================================================
FILE: src/theme/prism/prism-tlb.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism/prism-tlb.js
================================================
Prism.languages.tlb = {
  'builtin': /\b(?:Bool|Both|Cell|Either|Maybe|Type|Unit|bits256|bits512|int16|int32|int64|int8|uint15|uint16|uint32|uint63|uint64|uint8)\b/,
  'keyword': /\b(?:BoolFalse|BoolTrue|False|Null|True)\b/,

  'comment': {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  'comment-multiline': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
      greedy: true,
      alias: 'comment'
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true,
      alias: 'comment'
    }
  ],

  'symbol': [
    /#[0-9a-f]*_?/,
    /\$[01]*_?/,
    /\b(?:##|#<|#<=)\b/,
  ],
  'variable': /[a-zA-Z_]\w*/,
  'operator': [
    /\+/, /-/, /\*/, /\//,
    /!=/, /==/, /=/,
    /\?/, /~/, /\./, /\^/,
    /<=/, />=/, /</, />/,
  ],
  'number': /\d+/,
  'punctuation': /[;\(\):\[\]\{\}]/,
};


================================================
FILE: src/theme/prism/prism-tolk.js
URL: https://github.com/ton-community/ton-docs/blob/main/src/theme/prism/prism-tolk.js
================================================
/**
 * @file Prism.js definition for Tolk (next-generation FunC)
 * @version 0.12.0
 * @author Aleksandr Kirsanov (https://github.com/tolk-vm)
 * @license MIT
 */
(function(Prism) {
  Prism.languages.tolk = {
    'comment': [
      {
        pattern: /\/\/.*/,
        greedy: true,
      },
      {
        // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
        pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
        greedy: true,
      }
    ],

    'type-hint': /\b(enum|int|cell|void|never|bool|slice|tuple|builder|continuation|coins|int8|int16|int32|int64|uint8|uint16|uint32|uint64|uint256|bytes16|bytes32|bytes64|bits8|bits16|bits32|bits64|bits128|bits256|address)\b/,

    'boolean': /\b(false|true|null)\b/,

    'keyword': /\b(do|if|as|is|try|else|while|break|throw|catch|return|assert|repeat|continue|asm|builtin|import|export|true|false|null|redef|mutate|tolk|global|const|var|val|fun|get|struct|match|type)\b/,

    'self': /\b(self)\b/,

    'attr-name': /@[a-zA-Z0-9_]+/,

    'function': /[a-zA-Z$_][a-zA-Z0-9$_]*(?=(<[^>]+>)*\()/,

    'number': /\b(-?\d+|0x[\da-fA-F]+|0b[01]+)\b/,

    'string': [
      {
        pattern: /"""[\s\S]*?"""/,
        greedy: true,
      },
      {
        pattern: /"[^\n"]*"\w?/,
        greedy: true,
      },
    ],

    'operator': new RegExp("\\+|-|\\*|/|%|\\?|:|=|<|>|!|&|\\||\\^|==|!=|<=|>=|<<|>>|&&|\\|\\||~/|\\^/|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|->|<=>|~>>|\\^>>|<<=|>>=|=>"),

    'punctuation': /[.,;(){}\[\]]/,

    'variable': [
      { pattern: /`[^`]+`/ },
      { pattern: /\b[a-zA-Z$_][a-zA-Z0-9$_]*\b/ },
    ]
  };

}(Prism));



================================================
FILE: static/.nojekyll
URL: https://github.com/ton-community/ton-docs/blob/main/static/.nojekyll
================================================



================================================
FILE: static/audits/TON_Blockchain_CertiK.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TON_Blockchain_CertiK.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TON_Blockchain_Formal_Verification_CertiK.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TON_Blockchain_Formal_Verification_CertiK.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TON_Blockchain_SlowMist.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TON_Blockchain_SlowMist.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TON_Blockchain_ToB.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TON_Blockchain_ToB.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TON_Blockchain_tonlib_Zellic.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TON_Blockchain_tonlib_Zellic.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TVM_Upgrade_ToB_2023.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TVM_Upgrade_ToB_2023.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/audits/TVM_and_Fift_ToB.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/audits/TVM_and_Fift_ToB.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/catchain.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/catchain.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/example-code-snippets/pythoniq/jetton-offline-address-calc-wrapper.py
URL: https://github.com/ton-community/ton-docs/blob/main/static/example-code-snippets/pythoniq/jetton-offline-address-calc-wrapper.py
================================================
from pytoniq_core import Address, Cell, begin_cell


def calculate_jetton_address(
    owner_address: Address, jetton_master_address: Address, jetton_wallet_code: str
):
    # Recreate from jetton-utils.fc calculate_jetton_wallet_address()
    # https://tonscan.org/jetton/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs#source

    data_cell = (
        begin_cell()
        .store_uint(0, 4)
        .store_coins(0)
        .store_address(owner_address)
        .store_address(jetton_master_address)
        .end_cell()
    )

    code_cell = Cell.one_from_boc(jetton_wallet_code)

    state_init = (
        begin_cell()
        .store_uint(0, 2)
        .store_maybe_ref(code_cell)
        .store_maybe_ref(data_cell)
        .store_uint(0, 1)
        .end_cell()
    )
    state_init_hex = state_init.hash.hex()
    jetton_address = Address(f'0:{state_init_hex}')

    return jetton_address


def print_debug(d: dict):
    for k, v in d.items():
        print(f'{k: <25} {v}')


if __name__ == '__main__':
    # https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offline
    # https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=method
    # Execute "get_jetton_data" and copy last cell value (should be jetton_wallet_code, but they don't match)
    jetton_wallet_code = 'b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68'

    # USDT contract
    jetton_master_address = Address('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs')

    # User address
    owner_address = Address('UQANCZLrRHVnenvs31J26Y6vUcirln0-6zs_U18w93WaN2da')

    debug = {
        'jetton_master_address': jetton_master_address.to_str(),
        'owner_address': owner_address.to_str(is_bounceable=False),
    }

    jetton_address_calc = calculate_jetton_address(
        owner_address, jetton_master_address, jetton_wallet_code
    )
    jetton_address_calc_str = jetton_address_calc.to_str(
        is_user_friendly=True, is_url_safe=True, is_bounceable=False
    )
    debug['jetton_address calc'] = jetton_address_calc_str

    jetton_addr_by_node = 'UQAXgYVGR0rl2az6qPJcPlxFyiNKPCQckoI2ZXaGxLnWJGUf'
    debug['jetton_address by_node'] = jetton_addr_by_node

    debug['match'] = jetton_addr_by_node == jetton_address_calc_str

    print_debug(debug)


================================================
FILE: static/fiftbase.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/fiftbase.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/files/HackTonB.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/HackTonB.mp4
================================================
[Binary file blocked: HackTonB.mp4]


================================================
FILE: static/files/TON_nodes.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/TON_nodes.mp4
================================================
[File too large: 27.98 MB - skipped]


================================================
FILE: static/files/TonConnect.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/TonConnect.mp4
================================================
[Binary file blocked: TonConnect.mp4]


================================================
FILE: static/files/nft-sm.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/nft-sm.mp4
================================================
[Binary file blocked: nft-sm.mp4]


================================================
FILE: static/files/onboarding-nft.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/onboarding-nft.mp4
================================================
[Binary file blocked: onboarding-nft.mp4]


================================================
FILE: static/files/onboarding.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/onboarding.mp4
================================================
[Binary file blocked: onboarding.mp4]


================================================
FILE: static/files/tg-payments.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/tg-payments.mp4
================================================
[Binary file blocked: tg-payments.mp4]


================================================
FILE: static/files/twa.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/files/twa.mp4
================================================
[Binary file blocked: twa.mp4]


================================================
FILE: static/img/arrow.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/arrow.svg
================================================
[Binary file blocked: arrow.svg]


================================================
FILE: static/img/banner-bg.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/banner-bg.svg
================================================
[Binary file blocked: banner-bg.svg]


================================================
FILE: static/img/blueprint/logo.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/blueprint/logo.svg
================================================
[Binary file blocked: logo.svg]


================================================
FILE: static/img/docs/Jetton
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/Jetton
================================================




================================================
FILE: static/img/docs/OpenMask.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/OpenMask.png
================================================
[Binary file blocked: OpenMask.png]


================================================
FILE: static/img/docs/Sub-domains_ton.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/Sub-domains_ton.png
================================================
[Binary file blocked: Sub-domains_ton.png]


================================================
FILE: static/img/docs/asset-processing/alicemsgDAG.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/alicemsgDAG.svg
================================================
[Binary file blocked: alicemsgDAG.svg]


================================================
FILE: static/img/docs/asset-processing/jetton_contracts.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_contracts.png
================================================
[Binary file blocked: jetton_contracts.png]


================================================
FILE: static/img/docs/asset-processing/jetton_contracts.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_contracts.svg
================================================
[Binary file blocked: jetton_contracts.svg]


================================================
FILE: static/img/docs/asset-processing/jetton_contracts_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_contracts_dark.png
================================================
[Binary file blocked: jetton_contracts_dark.png]


================================================
FILE: static/img/docs/asset-processing/jetton_contracts_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_contracts_dark.svg
================================================
[Binary file blocked: jetton_contracts_dark.svg]


================================================
FILE: static/img/docs/asset-processing/jetton_transfer.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_transfer.png
================================================
[Binary file blocked: jetton_transfer.png]


================================================
FILE: static/img/docs/asset-processing/jetton_transfer.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_transfer.svg
================================================
[Binary file blocked: jetton_transfer.svg]


================================================
FILE: static/img/docs/asset-processing/jetton_transfer_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_transfer_dark.png
================================================
[Binary file blocked: jetton_transfer_dark.png]


================================================
FILE: static/img/docs/asset-processing/jetton_transfer_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/jetton_transfer_dark.svg
================================================
[Binary file blocked: jetton_transfer_dark.svg]


================================================
FILE: static/img/docs/asset-processing/msg_dag_example.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/asset-processing/msg_dag_example.svg
================================================
[Binary file blocked: msg_dag_example.svg]


================================================
FILE: static/img/docs/autorization.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/autorization.mp4
================================================
[Binary file blocked: autorization.mp4]


================================================
FILE: static/img/docs/blockchain-configs/config15-mainnet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-configs/config15-mainnet.png
================================================
[Binary file blocked: config15-mainnet.png]


================================================
FILE: static/img/docs/blockchain-configs/config15-testnet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-configs/config15-testnet.png
================================================
[Binary file blocked: config15-testnet.png]


================================================
FILE: static/img/docs/blockchain-fundamentals/scheme.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/scheme.png
================================================
[Binary file blocked: scheme.png]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains-merge.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains-merge.jpg
================================================
[Binary file blocked: shardchains-merge.jpg]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains-merge.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains-merge.png
================================================
[Binary file blocked: shardchains-merge.png]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains-split.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains-split.jpg
================================================
[Binary file blocked: shardchains-split.jpg]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains-split.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains-split.png
================================================
[Binary file blocked: shardchains-split.png]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains.jpg
================================================
[Binary file blocked: shardchains.jpg]


================================================
FILE: static/img/docs/blockchain-fundamentals/shardchains.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/shardchains.png
================================================
[Binary file blocked: shardchains.png]


================================================
FILE: static/img/docs/blockchain-fundamentals/split-merge.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/blockchain-fundamentals/split-merge.svg
================================================
[Binary file blocked: split-merge.svg]


================================================
FILE: static/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png
================================================
[Binary file blocked: Cells-as-data-storage_1_dark.png]


================================================
FILE: static/img/docs/cells-as-data-storage/dag.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/cells-as-data-storage/dag.png
================================================
[Binary file blocked: dag.png]


================================================
FILE: static/img/docs/data-formats/structure shceme 6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/structure shceme 6.png
================================================
[Binary file blocked: structure shceme 6.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-1-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-1-dark.png
================================================
[Binary file blocked: tl-b-docs-1-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-1.png
================================================
[Binary file blocked: tl-b-docs-1.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-10-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-10-dark.png
================================================
[Binary file blocked: tl-b-docs-10-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-10.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-10.png
================================================
[Binary file blocked: tl-b-docs-10.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-2-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-2-dark.png
================================================
[Binary file blocked: tl-b-docs-2-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-2.png
================================================
[Binary file blocked: tl-b-docs-2.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-3-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-3-dark.png
================================================
[Binary file blocked: tl-b-docs-3-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-3.png
================================================
[Binary file blocked: tl-b-docs-3.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-4-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-4-dark.png
================================================
[Binary file blocked: tl-b-docs-4-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-4.png
================================================
[Binary file blocked: tl-b-docs-4.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-5-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-5-dark.png
================================================
[Binary file blocked: tl-b-docs-5-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-5.png
================================================
[Binary file blocked: tl-b-docs-5.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-6-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-6-dark.png
================================================
[Binary file blocked: tl-b-docs-6-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-6.png
================================================
[Binary file blocked: tl-b-docs-6.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-7-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-7-dark.png
================================================
[Binary file blocked: tl-b-docs-7-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-7.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-7.png
================================================
[Binary file blocked: tl-b-docs-7.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-8-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-8-dark.png
================================================
[Binary file blocked: tl-b-docs-8-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-8.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-8.png
================================================
[Binary file blocked: tl-b-docs-8.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-9-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-9-dark.png
================================================
[Binary file blocked: tl-b-docs-9-dark.png]


================================================
FILE: static/img/docs/data-formats/tl-b-docs-9.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/data-formats/tl-b-docs-9.png
================================================
[Binary file blocked: tl-b-docs-9.png]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg
================================================
[Binary file blocked: ecosystem_messages_layout_1.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg
================================================
[Binary file blocked: ecosystem_messages_layout_10.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_10_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11.svg
================================================
[Binary file blocked: ecosystem_messages_layout_11.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_11_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_11_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12.svg
================================================
[Binary file blocked: ecosystem_messages_layout_12.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_12_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_12_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_1_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2.svg
================================================
[Binary file blocked: ecosystem_messages_layout_2.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_2_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_2_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3.svg
================================================
[Binary file blocked: ecosystem_messages_layout_3.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_3_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_3_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4.svg
================================================
[Binary file blocked: ecosystem_messages_layout_4.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_4_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_4_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg
================================================
[Binary file blocked: ecosystem_messages_layout_5.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_5_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.png
================================================
[Binary file blocked: ecosystem_messages_layout_6.png]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6.svg
================================================
[Binary file blocked: ecosystem_messages_layout_6.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.png
================================================
[Binary file blocked: ecosystem_messages_layout_6_dark.png]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_6_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_6_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7.svg
================================================
[Binary file blocked: ecosystem_messages_layout_7.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_7_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_7_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8.svg
================================================
[Binary file blocked: ecosystem_messages_layout_8.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_8_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_8_dark.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9.svg
================================================
[Binary file blocked: ecosystem_messages_layout_9.svg]


================================================
FILE: static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_9_dark.svg
================================================
[Binary file blocked: ecosystem_messages_layout_9_dark.svg]


================================================
FILE: static/img/docs/foundation_ton.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/foundation_ton.png
================================================
[Binary file blocked: foundation_ton.png]


================================================
FILE: static/img/docs/full-node/help.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/full-node/help.jpg
================================================
[Binary file blocked: help.jpg]


================================================
FILE: static/img/docs/full-node/import-acc.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/full-node/import-acc.png
================================================
[Binary file blocked: import-acc.png]


================================================
FILE: static/img/docs/full-node/local-validator-status-absent.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/full-node/local-validator-status-absent.png
================================================
[Binary file blocked: local-validator-status-absent.png]


================================================
FILE: static/img/docs/full-node/status-error.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/full-node/status-error.jpg
================================================
[Binary file blocked: status-error.jpg]


================================================
FILE: static/img/docs/getblock-img/unnamed-2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/getblock-img/unnamed-2.png
================================================
[Binary file blocked: unnamed-2.png]


================================================
FILE: static/img/docs/getblock-img/unnamed-3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/getblock-img/unnamed-3.png
================================================
[Binary file blocked: unnamed-3.png]


================================================
FILE: static/img/docs/getblock-img/unnamed-4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/getblock-img/unnamed-4.png
================================================
[Binary file blocked: unnamed-4.png]


================================================
FILE: static/img/docs/getblock-img/unnamed-5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/getblock-img/unnamed-5.png
================================================
[Binary file blocked: unnamed-5.png]


================================================
FILE: static/img/docs/getblock-img/unnamed-6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/getblock-img/unnamed-6.png
================================================
[Binary file blocked: unnamed-6.png]


================================================
FILE: static/img/docs/hacktoberfest.webp
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/hacktoberfest.webp
================================================
[Binary file blocked: hacktoberfest.webp]


================================================
FILE: static/img/docs/how-to-wallet/wallet_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/how-to-wallet/wallet_1.png
================================================
[Binary file blocked: wallet_1.png]


================================================
FILE: static/img/docs/hyperlinks.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/hyperlinks.mp4
================================================
[Binary file blocked: hyperlinks.mp4]


================================================
FILE: static/img/docs/in_a_browser.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/in_a_browser.jpg
================================================
[Binary file blocked: in_a_browser.jpg]


================================================
FILE: static/img/docs/main_pic.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/main_pic.png
================================================
[Binary file blocked: main_pic.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_1.png
================================================
[Binary file blocked: message_delivery_1.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_1_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_1_dark.png
================================================
[Binary file blocked: message_delivery_1_dark.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_2.png
================================================
[Binary file blocked: message_delivery_2.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_2_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_2_dark.png
================================================
[Binary file blocked: message_delivery_2_dark.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_3.png
================================================
[Binary file blocked: message_delivery_3.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_3_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_3_dark.png
================================================
[Binary file blocked: message_delivery_3_dark.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_4.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_4.svg
================================================
[Binary file blocked: message_delivery_4.svg]


================================================
FILE: static/img/docs/message-delivery/message_delivery_5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_5.png
================================================
[Binary file blocked: message_delivery_5.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_5_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_5_dark.png
================================================
[Binary file blocked: message_delivery_5_dark.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_6.png
================================================
[Binary file blocked: message_delivery_6.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_6_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_6_dark.png
================================================
[Binary file blocked: message_delivery_6_dark.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_7.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_7.png
================================================
[Binary file blocked: message_delivery_7.png]


================================================
FILE: static/img/docs/message-delivery/message_delivery_7_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/message_delivery_7_dark.png
================================================
[Binary file blocked: message_delivery_7_dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-1-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-1-dark.png
================================================
[Binary file blocked: msg-delivery-1-dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-1.png
================================================
[Binary file blocked: msg-delivery-1.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-2.png
================================================
[Binary file blocked: msg-delivery-2.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-3.png
================================================
[Binary file blocked: msg-delivery-3.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-3_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-3_dark.png
================================================
[Binary file blocked: msg-delivery-3_dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-4.png
================================================
[Binary file blocked: msg-delivery-4.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-4_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-4_dark.png
================================================
[Binary file blocked: msg-delivery-4_dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-5.png
================================================
[Binary file blocked: msg-delivery-5.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-5_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-5_dark.png
================================================
[Binary file blocked: msg-delivery-5_dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-6-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-6-dark.png
================================================
[Binary file blocked: msg-delivery-6-dark.png]


================================================
FILE: static/img/docs/message-delivery/msg-delivery-6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-delivery/msg-delivery-6.png
================================================
[Binary file blocked: msg-delivery-6.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_10.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_10.png
================================================
[Binary file blocked: carry_remaining_value_10.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_10_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_10_dark.png
================================================
[Binary file blocked: carry_remaining_value_10_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_11_error.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_11_error.png
================================================
[Binary file blocked: carry_remaining_value_11_error.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_11_error_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_11_error_dark.png
================================================
[Binary file blocked: carry_remaining_value_11_error_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror.png
================================================
[Binary file blocked: carry_remaining_value_11_noerror.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_11_noerror_dark.png
================================================
[Binary file blocked: carry_remaining_value_11_noerror_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_12.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_12.png
================================================
[Binary file blocked: carry_remaining_value_12.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_12_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_12_dark.png
================================================
[Binary file blocked: carry_remaining_value_12_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_6.png
================================================
[Binary file blocked: carry_remaining_value_6.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_6_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_6_dark.png
================================================
[Binary file blocked: carry_remaining_value_6_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_7.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_7.png
================================================
[Binary file blocked: carry_remaining_value_7.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_7_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_7_dark.png
================================================
[Binary file blocked: carry_remaining_value_7_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_8_error.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_8_error.png
================================================
[Binary file blocked: carry_remaining_value_8_error.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_8_error_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_8_error_dark.png
================================================
[Binary file blocked: carry_remaining_value_8_error_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror.png
================================================
[Binary file blocked: carry_remaining_value_8_noerror.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_8_noerror_dark.png
================================================
[Binary file blocked: carry_remaining_value_8_noerror_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_9_error.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_9_error.png
================================================
[Binary file blocked: carry_remaining_value_9_error.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_9_error_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_9_error_dark.png
================================================
[Binary file blocked: carry_remaining_value_9_error_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror.png
================================================
[Binary file blocked: carry_remaining_value_9_noerror.png]


================================================
FILE: static/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/carry_remaining_value_9_noerror_dark.png
================================================
[Binary file blocked: carry_remaining_value_9_noerror_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_1.png
================================================
[Binary file blocked: send_regular_message_1.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_1_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_1_dark.png
================================================
[Binary file blocked: send_regular_message_1_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_2.png
================================================
[Binary file blocked: send_regular_message_2.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_2_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_2_dark.png
================================================
[Binary file blocked: send_regular_message_2_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_3_error.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_3_error.png
================================================
[Binary file blocked: send_regular_message_3_error.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_3_error_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_3_error_dark.png
================================================
[Binary file blocked: send_regular_message_3_error_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_3_noerror.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_3_noerror.png
================================================
[Binary file blocked: send_regular_message_3_noerror.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_3_noerror_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_3_noerror_dark.png
================================================
[Binary file blocked: send_regular_message_3_noerror_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_4.png
================================================
[Binary file blocked: send_regular_message_4.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_4_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_4_dark.png
================================================
[Binary file blocked: send_regular_message_4_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_5_error.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_5_error.png
================================================
[Binary file blocked: send_regular_message_5_error.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_5_error_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_5_error_dark.png
================================================
[Binary file blocked: send_regular_message_5_error_dark.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_5_noerror.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_5_noerror.png
================================================
[Binary file blocked: send_regular_message_5_noerror.png]


================================================
FILE: static/img/docs/message-modes-cookbook/send_regular_message_5_noerror_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/message-modes-cookbook/send_regular_message_5_noerror_dark.png
================================================
[Binary file blocked: send_regular_message_5_noerror_dark.png]


================================================
FILE: static/img/docs/mylocalton-demo.gif
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mylocalton-demo.gif
================================================
[File too large: 25.83 MB - skipped]


================================================
FILE: static/img/docs/mylocalton.jpeg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mylocalton.jpeg
================================================
[Binary file blocked: mylocalton.jpeg]


================================================
FILE: static/img/docs/mytonctrl/bl.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/bl.png
================================================
[Binary file blocked: bl.png]


================================================
FILE: static/img/docs/mytonctrl/db.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/db.png
================================================
[Binary file blocked: db.png]


================================================
FILE: static/img/docs/mytonctrl/dw.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/dw.png
================================================
[Binary file blocked: dw.png]


================================================
FILE: static/img/docs/mytonctrl/ew.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/ew.png
================================================
[Binary file blocked: ew.png]


================================================
FILE: static/img/docs/mytonctrl/installer.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/installer.png
================================================
[Binary file blocked: installer.png]


================================================
FILE: static/img/docs/mytonctrl/nb.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/nb.png
================================================
[Binary file blocked: nb.png]


================================================
FILE: static/img/docs/mytonctrl/nw.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/nw.png
================================================
[Binary file blocked: nw.png]


================================================
FILE: static/img/docs/mytonctrl/status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/status.png
================================================
[Binary file blocked: status.png]


================================================
FILE: static/img/docs/mytonctrl/test-pools-list.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/test-pools-list.png
================================================
[Binary file blocked: test-pools-list.png]


================================================
FILE: static/img/docs/mytonctrl/tetsnet-conf.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/tetsnet-conf.png
================================================
[Binary file blocked: tetsnet-conf.png]


================================================
FILE: static/img/docs/mytonctrl/vah.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/vah.png
================================================
[Binary file blocked: vah.png]


================================================
FILE: static/img/docs/mytonctrl/vas.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/vas.png
================================================
[Binary file blocked: vas.png]


================================================
FILE: static/img/docs/mytonctrl/wl.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/mytonctrl/wl.png
================================================
[Binary file blocked: wl.png]


================================================
FILE: static/img/docs/nodes-validator/manual-ubuntu_mytoncore-log.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/nodes-validator/manual-ubuntu_mytoncore-log.png
================================================
[Binary file blocked: manual-ubuntu_mytoncore-log.png]


================================================
FILE: static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png
================================================
[Binary file blocked: manual-ubuntu_mytonctrl-set_ru.png]


================================================
FILE: static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png
================================================
[Binary file blocked: manual-ubuntu_mytonctrl-vas-aw_ru.png]


================================================
FILE: static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png
================================================
[Binary file blocked: manual-ubuntu_mytonctrl-wl_ru.png]


================================================
FILE: static/img/docs/nodes-validator/mytonctrl-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/nodes-validator/mytonctrl-status.png
================================================
[Binary file blocked: mytonctrl-status.png]


================================================
FILE: static/img/docs/oracles/red-stone/data-package-data.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/oracles/red-stone/data-package-data.png
================================================
[Binary file blocked: data-package-data.png]


================================================
FILE: static/img/docs/oracles/red-stone/data-package-sig.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/oracles/red-stone/data-package-sig.png
================================================
[Binary file blocked: data-package-sig.png]


================================================
FILE: static/img/docs/oracles/red-stone/payload-metadata.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/oracles/red-stone/payload-metadata.png
================================================
[Binary file blocked: payload-metadata.png]


================================================
FILE: static/img/docs/oracles/red-stone/sample-serialization.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/oracles/red-stone/sample-serialization.png
================================================
[Binary file blocked: sample-serialization.png]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1.png
================================================
[Binary file blocked: Graphic-Explanations-Guidelines_1.png]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1_dark.png
================================================
[Binary file blocked: Graphic-Explanations-Guidelines_1_dark.png]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/circle_for_smart_contract.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/circle_for_smart_contract.svg
================================================
[Binary file blocked: circle_for_smart_contract.svg]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/dashed_rectgl_for_optional_message.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/dashed_rectgl_for_optional_message.svg
================================================
[Binary file blocked: dashed_rectgl_for_optional_message.svg]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/line_for_transaction.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/line_for_transaction.svg
================================================
[Binary file blocked: line_for_transaction.svg]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/person_figure_for_actor.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/person_figure_for_actor.svg
================================================
[Binary file blocked: person_figure_for_actor.svg]


================================================
FILE: static/img/docs/scheme-templates/message-processing-graphs/rectangle_for_regular_message.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/scheme-templates/message-processing-graphs/rectangle_for_regular_message.svg
================================================
[Binary file blocked: rectangle_for_regular_message.svg]


================================================
FILE: static/img/docs/security-measures/secure-programming/smart1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/security-measures/secure-programming/smart1.png
================================================
[Binary file blocked: smart1.png]


================================================
FILE: static/img/docs/security-measures/secure-programming/smart2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/security-measures/secure-programming/smart2.png
================================================
[Binary file blocked: smart2.png]


================================================
FILE: static/img/docs/security-measures/secure-programming/smart3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/security-measures/secure-programming/smart3.png
================================================
[Binary file blocked: smart3.png]


================================================
FILE: static/img/docs/single-nominator/election-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/election-status.png
================================================
[Binary file blocked: election-status.png]


================================================
FILE: static/img/docs/single-nominator/new-stake.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/new-stake.png
================================================
[Binary file blocked: new-stake.png]


================================================
FILE: static/img/docs/single-nominator/status-validator.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/status-validator.png
================================================
[Binary file blocked: status-validator.png]


================================================
FILE: static/img/docs/single-nominator/testnet-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/testnet-status.png
================================================
[Binary file blocked: testnet-status.png]


================================================
FILE: static/img/docs/single-nominator/tetsnet-conf.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/tetsnet-conf.png
================================================
[Binary file blocked: tetsnet-conf.png]


================================================
FILE: static/img/docs/single-nominator/validator-profit-vas.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/validator-profit-vas.png
================================================
[Binary file blocked: validator-profit-vas.png]


================================================
FILE: static/img/docs/single-nominator/validator-profit.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/validator-profit.png
================================================
[Binary file blocked: validator-profit.png]


================================================
FILE: static/img/docs/single-nominator/vl-activated.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/single-nominator/vl-activated.png
================================================
[Binary file blocked: vl-activated.png]


================================================
FILE: static/img/docs/sync-async.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/sync-async.png
================================================
[Binary file blocked: sync-async.png]


================================================
FILE: static/img/docs/tact-abi-example.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tact-abi-example.png
================================================
[Binary file blocked: tact-abi-example.png]


================================================
FILE: static/img/docs/tact-abi.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tact-abi.png
================================================
[Binary file blocked: tact-abi.png]


================================================
FILE: static/img/docs/telegram-apps/closing-behaviour.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/closing-behaviour.svg
================================================
[Binary file blocked: closing-behaviour.svg]


================================================
FILE: static/img/docs/telegram-apps/eruda-1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/eruda-1.png
================================================
[Binary file blocked: eruda-1.png]


================================================
FILE: static/img/docs/telegram-apps/eruda-2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/eruda-2.png
================================================
[Binary file blocked: eruda-2.png]


================================================
FILE: static/img/docs/telegram-apps/eruda-3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/eruda-3.png
================================================
[Binary file blocked: eruda-3.png]


================================================
FILE: static/img/docs/telegram-apps/modern-1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/modern-1.png
================================================
[Binary file blocked: modern-1.png]


================================================
FILE: static/img/docs/telegram-apps/modern-2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/modern-2.png
================================================
[Binary file blocked: modern-2.png]


================================================
FILE: static/img/docs/telegram-apps/publish-tg-1.jpeg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/publish-tg-1.jpeg
================================================
[Binary file blocked: publish-tg-1.jpeg]


================================================
FILE: static/img/docs/telegram-apps/tapps.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/telegram-apps/tapps.png
================================================
[Binary file blocked: tapps.png]


================================================
FILE: static/img/docs/tlb.drawio.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tlb.drawio.svg
================================================
[Binary file blocked: tlb.drawio.svg]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_1.png
================================================
[Binary file blocked: tma-design_1.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_2.png
================================================
[Binary file blocked: tma-design_2.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_3.png
================================================
[Binary file blocked: tma-design_3.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_4.png
================================================
[Binary file blocked: tma-design_4.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_5.png
================================================
[Binary file blocked: tma-design_5.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_6.png
================================================
[Binary file blocked: tma-design_6.png]


================================================
FILE: static/img/docs/tma-design-guidelines/tma-design_7.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/tma-design-guidelines/tma-design_7.png
================================================
[Binary file blocked: tma-design_7.png]


================================================
FILE: static/img/docs/ton-connect/ton-connect-2_1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton-connect-2_1.png
================================================
[Binary file blocked: ton-connect-2_1.png]


================================================
FILE: static/img/docs/ton-connect/ton-connect-overview.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton-connect-overview.png
================================================
[Binary file blocked: ton-connect-overview.png]


================================================
FILE: static/img/docs/ton-connect/ton-connect.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton-connect.png
================================================
[Binary file blocked: ton-connect.png]


================================================
FILE: static/img/docs/ton-connect/ton-connect_1-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton-connect_1-dark.svg
================================================
[Binary file blocked: ton-connect_1-dark.svg]


================================================
FILE: static/img/docs/ton-connect/ton-connect_1.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton-connect_1.svg
================================================
[Binary file blocked: ton-connect_1.svg]


================================================
FILE: static/img/docs/ton-connect/ton_proof_scheme-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton_proof_scheme-dark.svg
================================================
[Binary file blocked: ton_proof_scheme-dark.svg]


================================================
FILE: static/img/docs/ton-connect/ton_proof_scheme.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-connect/ton_proof_scheme.svg
================================================
[Binary file blocked: ton_proof_scheme.svg]


================================================
FILE: static/img/docs/ton-jetbrains-plugin.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-jetbrains-plugin.png
================================================
[Binary file blocked: ton-jetbrains-plugin.png]


================================================
FILE: static/img/docs/ton-payments.jpeg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton-payments.jpeg
================================================
[Binary file blocked: ton-payments.jpeg]


================================================
FILE: static/img/docs/ton_sites.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton_sites.png
================================================
[Binary file blocked: ton_sites.png]


================================================
FILE: static/img/docs/ton_www.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/ton_www.mp4
================================================
[Binary file blocked: ton_www.mp4]


================================================
FILE: static/img/docs/wallet-apps/CryptoBot.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/CryptoBot.png
================================================
[Binary file blocked: CryptoBot.png]


================================================
FILE: static/img/docs/wallet-apps/MyTonWallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/MyTonWallet.png
================================================
[Binary file blocked: MyTonWallet.png]


================================================
FILE: static/img/docs/wallet-apps/OpenMask.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/OpenMask.png
================================================
[Binary file blocked: OpenMask.png]


================================================
FILE: static/img/docs/wallet-apps/TonWallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/TonWallet.png
================================================
[Binary file blocked: TonWallet.png]


================================================
FILE: static/img/docs/wallet-apps/ToncoinWallet-testnet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/ToncoinWallet-testnet.png
================================================
[Binary file blocked: ToncoinWallet-testnet.png]


================================================
FILE: static/img/docs/wallet-apps/Tonhub.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/Tonhub.png
================================================
[Binary file blocked: Tonhub.png]


================================================
FILE: static/img/docs/wallet-apps/Tonkeeper-testnet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/Tonkeeper-testnet.png
================================================
[Binary file blocked: Tonkeeper-testnet.png]


================================================
FILE: static/img/docs/wallet-apps/Tonkeeper.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/Tonkeeper.png
================================================
[Binary file blocked: Tonkeeper.png]


================================================
FILE: static/img/docs/wallet-apps/Wallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/Wallet.png
================================================
[Binary file blocked: Wallet.png]


================================================
FILE: static/img/docs/wallet-apps/send-bot.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/send-bot.png
================================================
[Binary file blocked: send-bot.png]


================================================
FILE: static/img/docs/wallet-apps/tonrocketbot.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-apps/tonrocketbot.png
================================================
[Binary file blocked: tonrocketbot.png]


================================================
FILE: static/img/docs/wallet-contracts/wallet-contract-V5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-contracts/wallet-contract-V5.png
================================================
[Binary file blocked: wallet-contract-V5.png]


================================================
FILE: static/img/docs/wallet-contracts/wallet-contract-V5_dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallet-contracts/wallet-contract-V5_dark.png
================================================
[Binary file blocked: wallet-contract-V5_dark.png]


================================================
FILE: static/img/docs/wallets.mp4
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/wallets.mp4
================================================
[Binary file blocked: wallets.mp4]


================================================
FILE: static/img/docs/writing-test-examples/fireworks_trace_tonviewer.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/fireworks_trace_tonviewer.png
================================================
[Binary file blocked: fireworks_trace_tonviewer.png]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes-dark.svg
================================================
[Binary file blocked: test-examples-schemes-dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes.svg
================================================
[Binary file blocked: test-examples-schemes.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id0.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id0.svg
================================================
[Binary file blocked: test-examples-schemes_id0.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id1.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id1.svg
================================================
[Binary file blocked: test-examples-schemes_id1.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id1_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id1_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id1_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id2.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id2.svg
================================================
[Binary file blocked: test-examples-schemes_id2.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id2_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id2_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id2_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id3.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id3.svg
================================================
[Binary file blocked: test-examples-schemes_id3.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id3_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id3_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id3_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id4.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id4.svg
================================================
[Binary file blocked: test-examples-schemes_id4.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id4_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id4_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id4_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id5.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id5.svg
================================================
[Binary file blocked: test-examples-schemes_id5.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id5_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id5_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id5_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id6.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id6.svg
================================================
[Binary file blocked: test-examples-schemes_id6.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id6_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id6_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id6_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id7.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id7.svg
================================================
[Binary file blocked: test-examples-schemes_id7.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id7_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id7_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id7_dark.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id8.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id8.svg
================================================
[Binary file blocked: test-examples-schemes_id8.svg]


================================================
FILE: static/img/docs/writing-test-examples/test-examples-schemes_id8_dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/docs/writing-test-examples/test-examples-schemes_id8_dark.svg
================================================
[Binary file blocked: test-examples-schemes_id8_dark.svg]


================================================
FILE: static/img/explorers-in-ton/eit-dton-info.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-dton-info.png
================================================
[Binary file blocked: eit-dton-info.png]


================================================
FILE: static/img/explorers-in-ton/eit-dton-txn.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-dton-txn.png
================================================
[Binary file blocked: eit-dton-txn.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonnftexplorer-info.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonnftexplorer-info.png
================================================
[Binary file blocked: eit-tonnftexplorer-info.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonnftexplorer-nftdata.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonnftexplorer-nftdata.png
================================================
[Binary file blocked: eit-tonnftexplorer-nftdata.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonscan-info.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonscan-info.png
================================================
[Binary file blocked: eit-tonscan-info.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonscan-txn.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonscan-txn.png
================================================
[Binary file blocked: eit-tonscan-txn.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonviewer-info.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonviewer-info.png
================================================
[Binary file blocked: eit-tonviewer-info.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonviewer-txn.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonviewer-txn.png
================================================
[Binary file blocked: eit-tonviewer-txn.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonwhales-info.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonwhales-info.png
================================================
[Binary file blocked: eit-tonwhales-info.png]


================================================
FILE: static/img/explorers-in-ton/eit-tonwhales-txn.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/explorers-in-ton/eit-tonwhales-txn.png
================================================
[Binary file blocked: eit-tonwhales-txn.png]


================================================
FILE: static/img/favicon.ico
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/favicon.ico
================================================
[Binary file blocked: favicon.ico]


================================================
FILE: static/img/favicon32x32.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/favicon32x32.png
================================================
[Binary file blocked: favicon32x32.png]


================================================
FILE: static/img/gasless.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/gasless.jpg
================================================
[Binary file blocked: gasless.jpg]


================================================
FILE: static/img/interaction-schemes/ecosystem.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/interaction-schemes/ecosystem.svg
================================================
[Binary file blocked: ecosystem.svg]


================================================
FILE: static/img/interaction-schemes/jettons.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/interaction-schemes/jettons.svg
================================================
[Binary file blocked: jettons.svg]


================================================
FILE: static/img/interaction-schemes/nft.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/interaction-schemes/nft.svg
================================================
[Binary file blocked: nft.svg]


================================================
FILE: static/img/interaction-schemes/wallets.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/interaction-schemes/wallets.svg
================================================
[Binary file blocked: wallets.svg]


================================================
FILE: static/img/localizationProgramGuideline/create-tasks.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/create-tasks.png
================================================
[Binary file blocked: create-tasks.png]


================================================
FILE: static/img/localizationProgramGuideline/generate-reports.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/generate-reports.png
================================================
[Binary file blocked: generate-reports.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png
================================================
[Binary file blocked: config-crowdin-deepl.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/create-new-project.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/create-new-project.png
================================================
[Binary file blocked: create-new-project.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/create-project-setting.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/create-project-setting.png
================================================
[Binary file blocked: create-project-setting.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png
================================================
[Binary file blocked: crowdin-glossary.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/frequency-save.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/frequency-save.png
================================================
[Binary file blocked: frequency-save.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/github-glossary.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/github-glossary.png
================================================
[Binary file blocked: github-glossary.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/install-github-integration.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/install-github-integration.png
================================================
[Binary file blocked: install-github-integration.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/pre-translate-config.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/pre-translate-config.png
================================================
[Binary file blocked: pre-translate-config.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/pre-translation.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/pre-translation.png
================================================
[Binary file blocked: pre-translation.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/projectId.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/projectId.png
================================================
[Binary file blocked: projectId.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/search-repo.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/search-repo.png
================================================
[Binary file blocked: search-repo.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/select-api-tool.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/select-api-tool.png
================================================
[Binary file blocked: select-api-tool.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/select-deepl.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/select-deepl.png
================================================
[Binary file blocked: select-deepl.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/select-integration-mode.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/select-integration-mode.png
================================================
[Binary file blocked: select-integration-mode.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/setting-branch.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/setting-branch.png
================================================
[Binary file blocked: setting-branch.png]


================================================
FILE: static/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png
================================================
[Binary file blocked: ton-i18n-glossary.png]


================================================
FILE: static/img/localizationProgramGuideline/ko_preview.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/ko_preview.png
================================================
[Binary file blocked: ko_preview.png]


================================================
FILE: static/img/localizationProgramGuideline/localization-program.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/localization-program.png
================================================
[Binary file blocked: localization-program.png]


================================================
FILE: static/img/localizationProgramGuideline/manage-members.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/manage-members.png
================================================
[Binary file blocked: manage-members.png]


================================================
FILE: static/img/localizationProgramGuideline/preview-link.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/preview-link.png
================================================
[Binary file blocked: preview-link.png]


================================================
FILE: static/img/localizationProgramGuideline/proofread-approved.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/proofread-approved.png
================================================
[Binary file blocked: proofread-approved.png]


================================================
FILE: static/img/localizationProgramGuideline/proofread-filter.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/proofread-filter.png
================================================
[Binary file blocked: proofread-filter.png]


================================================
FILE: static/img/localizationProgramGuideline/proofread-step1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/proofread-step1.png
================================================
[Binary file blocked: proofread-step1.png]


================================================
FILE: static/img/localizationProgramGuideline/redirect-to-next.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/redirect-to-next.png
================================================
[Binary file blocked: redirect-to-next.png]


================================================
FILE: static/img/localizationProgramGuideline/side-by-side.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/side-by-side.png
================================================
[Binary file blocked: side-by-side.png]


================================================
FILE: static/img/localizationProgramGuideline/translator-filter.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/translator-filter.png
================================================
[Binary file blocked: translator-filter.png]


================================================
FILE: static/img/localizationProgramGuideline/translator-save.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/translator-save.png
================================================
[Binary file blocked: translator-save.png]


================================================
FILE: static/img/localizationProgramGuideline/translator-select.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/localizationProgramGuideline/translator-select.png
================================================
[Binary file blocked: translator-select.png]


================================================
FILE: static/img/mainPageCards/developer-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/developer-dark.svg
================================================
[Binary file blocked: developer-dark.svg]


================================================
FILE: static/img/mainPageCards/developer-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/developer-light.svg
================================================
[Binary file blocked: developer-light.svg]


================================================
FILE: static/img/mainPageCards/participate-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/participate-dark.svg
================================================
[Binary file blocked: participate-dark.svg]


================================================
FILE: static/img/mainPageCards/participate-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/participate-light.svg
================================================
[Binary file blocked: participate-light.svg]


================================================
FILE: static/img/mainPageCards/what_is_ton-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/what_is_ton-dark.svg
================================================
[Binary file blocked: what_is_ton-dark.svg]


================================================
FILE: static/img/mainPageCards/what_is_ton-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/mainPageCards/what_is_ton-light.svg
================================================
[Binary file blocked: what_is_ton-light.svg]


================================================
FILE: static/img/nominator-pool/hot-wallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/nominator-pool/hot-wallet.png
================================================
[Binary file blocked: hot-wallet.png]


================================================
FILE: static/img/nominator-pool/nominator-pool.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/nominator-pool/nominator-pool.png
================================================
[Binary file blocked: nominator-pool.png]


================================================
FILE: static/img/nominator-pool/restricted-wallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/nominator-pool/restricted-wallet.png
================================================
[Binary file blocked: restricted-wallet.png]


================================================
FILE: static/img/nominator-pool/single-nominator-architecture.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/nominator-pool/single-nominator-architecture.png
================================================
[Binary file blocked: single-nominator-architecture.png]


================================================
FILE: static/img/readme/about.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/readme/about.png
================================================
[Binary file blocked: about.png]


================================================
FILE: static/img/readme/check.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/readme/check.png
================================================
[Binary file blocked: check.png]


================================================
FILE: static/img/readme/contribute.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/readme/contribute.png
================================================
[Binary file blocked: contribute.png]


================================================
FILE: static/img/readme/how.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/readme/how.png
================================================
[Binary file blocked: how.png]


================================================
FILE: static/img/registration-process/create-api-key.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/registration-process/create-api-key.png
================================================
[Binary file blocked: create-api-key.png]


================================================
FILE: static/img/registration-process/telegram-bot.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/registration-process/telegram-bot.png
================================================
[Binary file blocked: telegram-bot.png]


================================================
FILE: static/img/registration-process/toncenter-main-miniapp.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/registration-process/toncenter-main-miniapp.png
================================================
[Binary file blocked: toncenter-main-miniapp.png]


================================================
FILE: static/img/snippet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/snippet.png
================================================
[Binary file blocked: snippet.png]


================================================
FILE: static/img/ton_logo_dark_background.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/ton_logo_dark_background.svg
================================================
[Binary file blocked: ton_logo_dark_background.svg]


================================================
FILE: static/img/ton_logo_light_background.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/ton_logo_light_background.svg
================================================
[Binary file blocked: ton_logo_light_background.svg]


================================================
FILE: static/img/ton_symbol.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/ton_symbol.svg
================================================
[Binary file blocked: ton_symbol.svg]


================================================
FILE: static/img/ton_symbol_old-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/ton_symbol_old-dark.svg
================================================
[Binary file blocked: ton_symbol_old-dark.svg]


================================================
FILE: static/img/ton_symbol_old-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/ton_symbol_old-light.svg
================================================
[Binary file blocked: ton_symbol_old-light.svg]


================================================
FILE: static/img/tutorials/.nojekyll
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/.nojekyll
================================================



================================================
FILE: static/img/tutorials/apiatb-bot.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/apiatb-bot.png
================================================
[Binary file blocked: apiatb-bot.png]


================================================
FILE: static/img/tutorials/bot1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/bot1.png
================================================
[Binary file blocked: bot1.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/jetton-active-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/jetton-active-status.png
================================================
[Binary file blocked: jetton-active-status.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/no-gamefi-yet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/no-gamefi-yet.png
================================================
[Binary file blocked: no-gamefi-yet.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/purchase-confirmation.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/purchase-confirmation.png
================================================
[Binary file blocked: purchase-confirmation.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/purchase-done.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/purchase-done.png
================================================
[Binary file blocked: purchase-done.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/purchase-item.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/purchase-item.png
================================================
[Binary file blocked: purchase-item.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/sbt-rewarded.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/sbt-rewarded.png
================================================
[Binary file blocked: sbt-rewarded.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/sbts-in-wallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/sbts-in-wallet.png
================================================
[Binary file blocked: sbts-in-wallet.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/shop-enter-button.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/shop-enter-button.png
================================================
[Binary file blocked: shop-enter-button.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/wallet-connect-button.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/wallet-connect-button.png
================================================
[Binary file blocked: wallet-connect-button.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png
================================================
[Binary file blocked: wallet-connect-confirmation.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/wallet-connected.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/wallet-connected.png
================================================
[Binary file blocked: wallet-connected.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/wallet-nonexist-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/wallet-nonexist-status.png
================================================
[Binary file blocked: wallet-nonexist-status.png]


================================================
FILE: static/img/tutorials/gamefi-flappy/wallet-uninit-status.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/gamefi-flappy/wallet-uninit-status.png
================================================
[Binary file blocked: wallet-uninit-status.png]


================================================
FILE: static/img/tutorials/jetton/jetton-balance-token.PNG
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-balance-token.PNG
================================================
[Binary file blocked: jetton-balance-token.PNG]


================================================
FILE: static/img/tutorials/jetton/jetton-burn-tokens.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-burn-tokens.png
================================================
[Binary file blocked: jetton-burn-tokens.png]


================================================
FILE: static/img/tutorials/jetton/jetton-connect-wallet.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-connect-wallet.png
================================================
[Binary file blocked: jetton-connect-wallet.png]


================================================
FILE: static/img/tutorials/jetton/jetton-main-page.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-main-page.png
================================================
[Binary file blocked: jetton-main-page.png]


================================================
FILE: static/img/tutorials/jetton/jetton-receive-tokens.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-receive-tokens.png
================================================
[Binary file blocked: jetton-receive-tokens.png]


================================================
FILE: static/img/tutorials/jetton/jetton-send-how.PNG
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-send-how.PNG
================================================
[Binary file blocked: jetton-send-how.PNG]


================================================
FILE: static/img/tutorials/jetton/jetton-send-tokens.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-send-tokens.png
================================================
[Binary file blocked: jetton-send-tokens.png]


================================================
FILE: static/img/tutorials/jetton/jetton-send-tutorial.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-send-tutorial.png
================================================
[Binary file blocked: jetton-send-tutorial.png]


================================================
FILE: static/img/tutorials/jetton/jetton-send-what.PNG
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-send-what.PNG
================================================
[Binary file blocked: jetton-send-what.PNG]


================================================
FILE: static/img/tutorials/jetton/jetton-token-logo.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-token-logo.png
================================================
[Binary file blocked: jetton-token-logo.png]


================================================
FILE: static/img/tutorials/jetton/jetton-wallet-address.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/jetton/jetton-wallet-address.png
================================================
[Binary file blocked: jetton-wallet-address.png]


================================================
FILE: static/img/tutorials/js-bot-preview.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/js-bot-preview.jpg
================================================
[Binary file blocked: js-bot-preview.jpg]


================================================
FILE: static/img/tutorials/nft/collection-metadata.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/collection-metadata.png
================================================
[Binary file blocked: collection-metadata.png]


================================================
FILE: static/img/tutorials/nft/collection.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/collection.png
================================================
[Binary file blocked: collection.png]


================================================
FILE: static/img/tutorials/nft/ducks.zip
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/ducks.zip
================================================
[Binary file blocked: ducks.zip]


================================================
FILE: static/img/tutorials/nft/eth-collection.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/eth-collection.png
================================================
[Binary file blocked: eth-collection.png]


================================================
FILE: static/img/tutorials/nft/item-metadata.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/item-metadata.png
================================================
[Binary file blocked: item-metadata.png]


================================================
FILE: static/img/tutorials/nft/nft-sale.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/nft-sale.png
================================================
[Binary file blocked: nft-sale.png]


================================================
FILE: static/img/tutorials/nft/ton-collection.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/nft/ton-collection.png
================================================
[Binary file blocked: ton-collection.png]


================================================
FILE: static/img/tutorials/onboarding/1-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/1-dark.png
================================================
[Binary file blocked: 1-dark.png]


================================================
FILE: static/img/tutorials/onboarding/1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/1.png
================================================
[Binary file blocked: 1.png]


================================================
FILE: static/img/tutorials/onboarding/2-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/2-dark.png
================================================
[Binary file blocked: 2-dark.png]


================================================
FILE: static/img/tutorials/onboarding/2.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/2.png
================================================
[Binary file blocked: 2.png]


================================================
FILE: static/img/tutorials/onboarding/3-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/3-dark.png
================================================
[Binary file blocked: 3-dark.png]


================================================
FILE: static/img/tutorials/onboarding/3.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/3.png
================================================
[Binary file blocked: 3.png]


================================================
FILE: static/img/tutorials/onboarding/4-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/4-dark.png
================================================
[Binary file blocked: 4-dark.png]


================================================
FILE: static/img/tutorials/onboarding/4.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/4.png
================================================
[Binary file blocked: 4.png]


================================================
FILE: static/img/tutorials/onboarding/5-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/5-dark.png
================================================
[Binary file blocked: 5-dark.png]


================================================
FILE: static/img/tutorials/onboarding/5.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/5.png
================================================
[Binary file blocked: 5.png]


================================================
FILE: static/img/tutorials/onboarding/6-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/6-dark.png
================================================
[Binary file blocked: 6-dark.png]


================================================
FILE: static/img/tutorials/onboarding/6.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/6.png
================================================
[Binary file blocked: 6.png]


================================================
FILE: static/img/tutorials/onboarding/7-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/7-dark.png
================================================
[Binary file blocked: 7-dark.png]


================================================
FILE: static/img/tutorials/onboarding/7.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/7.png
================================================
[Binary file blocked: 7.png]


================================================
FILE: static/img/tutorials/onboarding/8.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/onboarding/8.svg
================================================
[Binary file blocked: 8.svg]


================================================
FILE: static/img/tutorials/quick-start/active.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/active.png
================================================
[Binary file blocked: active.png]


================================================
FILE: static/img/tutorials/quick-start/explorer1.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/explorer1.png
================================================
[Binary file blocked: explorer1.png]


================================================
FILE: static/img/tutorials/quick-start/multi-contract-example-bright.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/multi-contract-example-bright.png
================================================
[Binary file blocked: multi-contract-example-bright.png]


================================================
FILE: static/img/tutorials/quick-start/multi-contract-example-dark.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/multi-contract-example-dark.png
================================================
[Binary file blocked: multi-contract-example-dark.png]


================================================
FILE: static/img/tutorials/quick-start/multi-contract.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/multi-contract.png
================================================
[Binary file blocked: multi-contract.png]


================================================
FILE: static/img/tutorials/quick-start/nonexist.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/nonexist.png
================================================
[Binary file blocked: nonexist.png]


================================================
FILE: static/img/tutorials/quick-start/tonkeeper-dark.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/tonkeeper-dark.jpg
================================================
[Binary file blocked: tonkeeper-dark.jpg]


================================================
FILE: static/img/tutorials/quick-start/tonkeeper-light.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/tonkeeper-light.jpg
================================================
[Binary file blocked: tonkeeper-light.jpg]


================================================
FILE: static/img/tutorials/quick-start/uninit.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/uninit.png
================================================
[Binary file blocked: uninit.png]


================================================
FILE: static/img/tutorials/quick-start/wallet-address.jpg
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/quick-start/wallet-address.jpg
================================================
[Binary file blocked: wallet-address.jpg]


================================================
FILE: static/img/tutorials/tonkeeper/test-mode.webp
URL: https://github.com/ton-community/ton-docs/blob/main/static/img/tutorials/tonkeeper/test-mode.webp
================================================
[Binary file blocked: test-mode.webp]


================================================
FILE: static/robots.txt
URL: https://github.com/ton-community/ton-docs/blob/main/static/robots.txt
================================================
# Algolia-Crawler-Verif: 219DA811252FA1D8


================================================
FILE: static/schemes-visio/10 message_delivery_7_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/10 message_delivery_7_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 10 message_delivery_7_dark.vsdx
Size: 18.36 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/11 msg-delivery-3_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/11 msg-delivery-3_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 11 msg-delivery-3_dark.vsdx
Size: 15.66 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/12 msg-delivery-4_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/12 msg-delivery-4_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 12 msg-delivery-4_dark.vsdx
Size: 16.07 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/12 msg-delivery-5_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/12 msg-delivery-5_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 12 msg-delivery-5_dark.vsdx
Size: 16.82 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/13 msg-delivery-6-dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/13 msg-delivery-6-dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 13 msg-delivery-6-dark.vsdx
Size: 17.04 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/14 test-examples-schemes-dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/14 test-examples-schemes-dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 14 test-examples-schemes-dark.vsdx
Size: 28.51 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/14 test-examples-schemes.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/14 test-examples-schemes.vsdx
================================================
[Microsoft Visio Diagram]

File: 14 test-examples-schemes.vsdx
Size: 21.98 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id1.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id1.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id1.vsdx
Size: 21.36 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id1_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id1_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id1_dark.vsdx
Size: 29.39 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id2.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id2.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id2.vsdx
Size: 21.01 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id2_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id2_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id2_dark.vsdx
Size: 29.00 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id3.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id3.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id3.vsdx
Size: 21.03 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id3_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id3_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id3_dark.vsdx
Size: 29.03 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id4.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id4.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id4.vsdx
Size: 21.04 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id4_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id4_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id4_dark.vsdx
Size: 29.04 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id5.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id5.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id5.vsdx
Size: 21.00 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id5_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id5_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id5_dark.vsdx
Size: 29.02 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id6.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id6.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id6.vsdx
Size: 20.98 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id6_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id6_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id6_dark.vsdx
Size: 29.02 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id7.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id7.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id7.vsdx
Size: 20.99 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id7_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id7_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id7_dark.vsdx
Size: 29.02 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id8.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id8.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id8.vsdx
Size: 20.99 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/15 test-examples-schemes_id8_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/15 test-examples-schemes_id8_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 15 test-examples-schemes_id8_dark.vsdx
Size: 29.00 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/2 Cells-as-data-storage_1_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/2 Cells-as-data-storage_1_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 2 Cells-as-data-storage_1_dark.vsdx
Size: 20.49 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/23 jetton_contracts_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/23 jetton_contracts_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 23 jetton_contracts_dark.vsdx
Size: 20.46 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/24 jetton_transfer_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/24 jetton_transfer_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 24 jetton_transfer_dark.vsdx
Size: 28.05 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_10.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_10.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_10.vsdx
Size: 49.14 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_11.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_11.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_11.vsdx
Size: 65.85 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_12.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_12.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_12.vsdx
Size: 49.98 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_6.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_6.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_6.vsdx
Size: 48.95 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_7.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_7.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_7.vsdx
Size: 49.72 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_8.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_8.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_8.vsdx
Size: 65.57 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 carry_remaining_value_9.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 carry_remaining_value_9.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 carry_remaining_value_9.vsdx
Size: 66.16 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 send_regular_message_1.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 send_regular_message_1.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 send_regular_message_1.vsdx
Size: 42.45 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 send_regular_message_2.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 send_regular_message_2.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 send_regular_message_2.vsdx
Size: 42.96 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 send_regular_message_3.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 send_regular_message_3.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 send_regular_message_3.vsdx
Size: 55.03 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 send_regular_message_4.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 send_regular_message_4.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 send_regular_message_4.vsdx
Size: 42.25 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/25 send_regular_message_5.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/25 send_regular_message_5.vsdx
================================================
[Microsoft Visio Diagram]

File: 25 send_regular_message_5.vsdx
Size: 54.80 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/26 Graphic-Explanations-Guidelines_1.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/26 Graphic-Explanations-Guidelines_1.vsdx
================================================
[Microsoft Visio Diagram]

File: 26 Graphic-Explanations-Guidelines_1.vsdx
Size: 24.41 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/26 Graphic-Explanations-Guidelines_1_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/26 Graphic-Explanations-Guidelines_1_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 26 Graphic-Explanations-Guidelines_1_dark.vsdx
Size: 19.02 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/26 message_delivery_2.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/26 message_delivery_2.vsdx
================================================
[Microsoft Visio Diagram]

File: 26 message_delivery_2.vsdx
Size: 18.32 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/26 message_delivery_2_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/26 message_delivery_2_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 26 message_delivery_2_dark.vsdx
Size: 18.68 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/26 message_delivery_7_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/26 message_delivery_7_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 26 message_delivery_7_dark.vsdx
Size: 18.29 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/3 wallet-contract-V5.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/3 wallet-contract-V5.vsdx
================================================
[Microsoft Visio Diagram]

File: 3 wallet-contract-V5.vsdx
Size: 34.69 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/3 wallet-contract-V5_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/3 wallet-contract-V5_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 3 wallet-contract-V5_dark.vsdx
Size: 33.97 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/3 wallet-contracts.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/3 wallet-contracts.vsdx
================================================
[Microsoft Visio Diagram]

File: 3 wallet-contracts.vsdx
Size: 44.94 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/4 message_delivery_1_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/4 message_delivery_1_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 4 message_delivery_1_dark.vsdx
Size: 18.63 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/5 message_delivery_2_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/5 message_delivery_2_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 5 message_delivery_2_dark.vsdx
Size: 18.02 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/6 message_delivery_3_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/6 message_delivery_3_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 6 message_delivery_3_dark.vsdx
Size: 21.74 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/7 message_delivery_5_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/7 message_delivery_5_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 7 message_delivery_5_dark.vsdx
Size: 15.68 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/8 msg-delivery-1-dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/8 msg-delivery-1-dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 8 msg-delivery-1-dark.vsdx
Size: 15.34 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/9 message_delivery_6_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/9 message_delivery_6_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: 9 message_delivery_6_dark.vsdx
Size: 18.33 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/New design.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/New design.vsdx
================================================
[Microsoft Visio Diagram]

File: New design.vsdx
Size: 386.61 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_1.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_1.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_1.vsdx
Size: 21.24 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_10.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_10.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_10.vsdx
Size: 87.44 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_10_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_10_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_10_dark.vsdx
Size: 87.50 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_11.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_11.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_11.vsdx
Size: 89.26 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_11_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_11_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_11_dark.vsdx
Size: 89.28 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_12.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_12.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_12.vsdx
Size: 87.03 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_12_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_12_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_12_dark.vsdx
Size: 87.05 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_1_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_1_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_1_dark.vsdx
Size: 21.24 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_2.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_2.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_2.vsdx
Size: 23.92 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_2_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_2_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_2_dark.vsdx
Size: 24.23 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_3.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_3.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_3.vsdx
Size: 87.17 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_3_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_3_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_3_dark.vsdx
Size: 87.64 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_4.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_4.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_4.vsdx
Size: 86.04 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_4_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_4_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_4_dark.vsdx
Size: 86.01 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_5.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_5.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_5.vsdx
Size: 106.18 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_5_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_5_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_5_dark.vsdx
Size: 106.25 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_6.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_6.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_6.vsdx
Size: 103.68 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_6_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_6_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_6_dark.vsdx
Size: 103.94 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_7.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_7.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_7.vsdx
Size: 86.81 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_7_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_7_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_7_dark.vsdx
Size: 86.93 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_8.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_8.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_8.vsdx
Size: 93.67 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_8_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_8_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_8_dark.vsdx
Size: 93.94 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_9.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_9.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_9.vsdx
Size: 90.81 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ecosystem_messages_layout_9_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ecosystem_messages_layout_9_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ecosystem_messages_layout_9_dark.vsdx
Size: 90.86 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/jetton_transfer_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/jetton_transfer_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: jetton_transfer_dark.vsdx
Size: 25.92 KB
Modified: Thu Jun 26 2025 16:13:11 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/message_processing.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/message_processing.vsdx
================================================
[Microsoft Visio Diagram]

File: message_processing.vsdx
Size: 319.58 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/message_processing_prototype.png
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/message_processing_prototype.png
================================================
[Binary file blocked: message_processing_prototype.png]


================================================
FILE: static/schemes-visio/readme.md
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/readme.md
================================================
# Overview

In this directory collected unified Visio schemes created specially for the docs.ton.org documentation.

## Font

It is preferable to use Inter fonts family.

## Colors

### Light Mode

* Pencil Nand Drawn(default theme)

### Dark Mode
* Font `#e3e3e3`
* Background `#232328`
* LightHighlit(arrows and scheme borders) `#058dd2` 
* DarkHighlight(arrows and scheme borders) `#0088cc`
* InnerBackGround(for nested blocks) `#333337`


================================================
FILE: static/schemes-visio/send_regular_message_4.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/send_regular_message_4.vsdx
================================================
[Microsoft Visio Diagram]

File: send_regular_message_4.vsdx
Size: 31.68 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/test-examples-schemes-dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/test-examples-schemes-dark.vsdx
================================================
[Microsoft Visio Diagram]

File: test-examples-schemes-dark.vsdx
Size: 28.51 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/test-examples-schemes.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/test-examples-schemes.vsdx
================================================
[Microsoft Visio Diagram]

File: test-examples-schemes.vsdx
Size: 21.98 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/tlb-schemes — dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/tlb-schemes — dark.vsdx
================================================
[Microsoft Visio Diagram]

File: tlb-schemes — dark.vsdx
Size: 122.81 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/tlb-schemes.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/tlb-schemes.vsdx
================================================
[Microsoft Visio Diagram]

File: tlb-schemes.vsdx
Size: 99.11 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ton-connect — dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ton-connect — dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ton-connect — dark.vsdx
Size: 72.94 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ton-connect.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ton-connect.vsdx
================================================
[Microsoft Visio Diagram]

File: ton-connect.vsdx
Size: 234.64 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ton_proof_scheme.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ton_proof_scheme.vsdx
================================================
[Microsoft Visio Diagram]

File: ton_proof_scheme.vsdx
Size: 55.81 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/ton_proof_scheme_dark.vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/ton_proof_scheme_dark.vsdx
================================================
[Microsoft Visio Diagram]

File: ton_proof_scheme_dark.vsdx
Size: 53.74 KB
Modified: Thu Jun 26 2025 16:13:12 GMT+0400 (Georgia Standard Time)

Diagram Analysis:
==================================================

[VSDX parsing temporarily disabled due to library issues]

This is a Microsoft Visio diagram file. It may contain:
- Flowcharts and process diagrams
- Network diagrams
- Organizational charts
- Technical architecture diagrams
- Engineering schematics
- Blockchain and cryptocurrency schemas
- System architecture diagrams

To properly parse this file, a working VSDX library is needed.
The file structure is based on Office Open XML format.



================================================
FILE: static/schemes-visio/~$$ecosystem_messages_layout_6.~vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/~$$ecosystem_messages_layout_6.~vsdx
================================================
��ࡱ�                >  ��	                               ����       ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������R o o t   E n t r y                                               ������������                                    ����                                                                            ������������                                                                                                                    ������������                                                                                                                    ������������                                                R o o t   E n t r y                                               ��������                               0�r� ��   @      v e r s i o n                                                          ����                                              o w n e r - u n i c o d e                                        ����   ����                                       
       o w n e r                                                        ����   ����                                              ��������   ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������m a c h i n e - u n i c o d e                                      ������������                                               m a c h i n e                                                     ������������                                                                                                                   ������������                                                                                                                    ������������                                                ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������WIN-7POTF2ATA46                                                 W I N - 7 P O T F 2 A T A 4 6                                   user                                                            u s e r                                                                                                                                                                                                                                                                                                                        


================================================
FILE: static/schemes-visio/~$$message_processing.~vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/~$$message_processing.~vsdx
================================================
��ࡱ�                >  ��	                               ����       ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������R o o t   E n t r y                                               ������������                                    ����                                                                            ������������                                                                                                                    ������������                                                                                                                    ������������                                                R o o t   E n t r y                                               ��������                               P�
 �c�   @      v e r s i o n                                                          ����                                              o w n e r - u n i c o d e                                        ����   ����                                              o w n e r                                                        ����   ����                                              ��������   ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������m a c h i n e - u n i c o d e                                      ������������                                               m a c h i n e                                                     ������������                                                                                                                   ������������                                                                                                                    ������������                                                ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������DESKTOP-LGVSH09                                                 D E S K T O P - L G V S H 0 9                                   AlexG                                                           A l e x G                                                                                                                                                                                                                                                                                                                      


================================================
FILE: static/schemes-visio/~$$ton-connect — dark.~vsdx
URL: https://github.com/ton-community/ton-docs/blob/main/static/schemes-visio/~$$ton-connect — dark.~vsdx
================================================
��ࡱ�                >  ��	                               ����       ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������R o o t   E n t r y                                               ������������                                    ����                                                                            ������������                                                                                                                    ������������                                                                                                                    ������������                                                R o o t   E n t r y                                               ��������                               ������   @      v e r s i o n                                                          ����                                              o w n e r - u n i c o d e                                        ����   ����                                              o w n e r                                                        ����   ����                                              ��������   ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������m a c h i n e - u n i c o d e                                      ������������                                               m a c h i n e                                                     ������������                                                                                                                   ������������                                                                                                                    ������������                                                ��������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������DESKTOP-LGVSH09                                                 D E S K T O P - L G V S H 0 9                                   AlexG                                                           A l e x G                                                                                                                                                                                                                                                                                                                      


================================================
FILE: static/svg/wrench-24px-dark.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/svg/wrench-24px-dark.svg
================================================
[Binary file blocked: wrench-24px-dark.svg]


================================================
FILE: static/svg/wrench-24px-light.svg
URL: https://github.com/ton-community/ton-docs/blob/main/static/svg/wrench-24px-light.svg
================================================
[Binary file blocked: wrench-24px-light.svg]


================================================
FILE: static/tblkch.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/tblkch.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi
URL: https://github.com/ton-community/ton-docs/blob/main/static/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi
================================================
[Binary file blocked: Win64OpenSSL_Light-1_1_1q.msi]


================================================
FILE: static/ton-binaries/windows/fiftlib.zip
URL: https://github.com/ton-community/ton-docs/blob/main/static/ton-binaries/windows/fiftlib.zip
================================================
[Binary file blocked: fiftlib.zip]


================================================
FILE: static/ton-trustless-bridge_tvm-and-zk_v1.1_23-05-15.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/ton-trustless-bridge_tvm-and-zk_v1.1_23-05-15.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/ton.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/ton.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/trustless-interaction-with-ton_v1.1_23-05-15.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/trustless-interaction-with-ton_v1.1_23-05-15.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: static/tvm.pdf
URL: https://github.com/ton-community/ton-docs/blob/main/static/tvm.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: tsconfig.json
URL: https://github.com/ton-community/ton-docs/blob/main/tsconfig.json
================================================
{
  // This file is not used in compilation. It is here just for a nice editor experience.
  "extends": "@tsconfig/docusaurus/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "resolveJsonModule": true
  }
}




# Repository: awesome-ton
URL: https://github.com/ton-community/awesome-ton
Branch: main

## Directory Structure:
```
└── awesome-ton/
    ├── README.md
    ├── logo/
        ├── ton_symbol.png
        ├── ton_symbol.svg
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/awesome-ton/blob/main/README.md
================================================
<!-- omit from toc -->
# Awesome TON (The Open Network) [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[<img src="logo/ton_symbol.svg" align="right" width="100">](https://ton.org)

[![TON Research](https://img.shields.io/badge/TON%20Research-0098EA?style=flat&logo=discourse&label=Forum&labelColor=gray)](https://tonresear.ch)
[![Telegram Foundation Group](https://img.shields.io/badge/TON%20Foundation-0098EA?logo=telegram&logoColor=white&style=flat)](https://t.me/tonblockchain)
[![Twitter Group](https://img.shields.io/twitter/follow/ton_blockchain)](https://twitter.com/ton_blockchain)

A carefully curated collection of outstanding libraries, tools, services, protocols, and smart contracts in the TON ecosystem. This list serves as a comprehensive resource for developers, researchers, and enthusiasts interested in building on The Open Network.

---

<!-- omit from toc -->
## Contents

- [🏛️ Official Resources](#️-official-resources)
- [🎓 Education](#-education)
  - [Basic Theory](#basic-theory)
  - [YouTube Educational Videos](#youtube-educational-videos)
  - [Community Tutorials](#community-tutorials)
  - [Smart Contract Examples](#smart-contract-examples)
  - [Guidelines](#guidelines)
- [🧑‍💻 Development](#-development)
  - [Dev Tools](#dev-tools)
  - [Libraries \& SDKs](#libraries--sdks)
  - [Community Support](#community-support)
- [🔌 Core Integrations](#-core-integrations)
  - [Authentication](#authentication)
  - [Telegram Web Apps (TWAs)](#telegram-web-apps-twas)
  - [API Services](#api-services)
- [🛠️ Utilities](#️-utilities)
- [🎨 Design Resources](#-design-resources)
- [🤝 Contribute](#-contribute)

---

## 🏛️ Official Resources
- [TON Documentation](https://docs.ton.org/) - Comprehensive technical documentation.
- [TON Community Blog](https://blog.ton.org/) - Official blog with ecosystem updates.
- [Hackathons & Contests](https://ton.org/events) - Official events and competitions.
- [TON Job Board](https://jobs.ton.org/) - Find or post TON ecosystem jobs.
- [TON Community on Telegram](https://t.me/toncoin) - Main community discussion group.

---

## 🎓 Education
### Basic Theory
- [Introduction to The Open Network](https://docs.ton.org/learn/introduction) - Foundational overview.
- [Blockchain & Smart Contract Fundamentals](https://blog.ton.org/what-is-blockchain) - Core concepts explained.
- [Smart Contract Addresses](https://docs.ton.org/learn/overviews/addresses) - Understanding TON addressing system.
- [TON for Solidity Developers](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) - Transitioning from EVM to TON.
- [TON Sites, TON WWW, TON Proxy](https://blog.ton.org/ton-sites) - TON's decentralized web infrastructure.

### YouTube Educational Videos

- TON Development Courses
  - [TON Dev Study](https://www.youtube.com/@WikiMar/playlists) - Educational playlists covering various TON development topics.
    - English
      - [FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)
      - [TON with Fift](https://www.youtube.com/playlist?list=PLyDBPwv9EPsB47mqzF4Z9K8k6HYqPv6Px)
      - [TON with Python](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDrQUyuHTsKRzxg6XaTPzhh)
      - [Tact & Blueprint](https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos)
    - Russian
      - [FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsA5vcUM2vzjQOomf264IdUZ)
      - [TON Connect Integration](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)
      - [TON with Python](https://www.youtube.com/playlist?list=PLyDBPwv9EPsC-7xbn8b8noZh9a1Xkg42W)
      - [TON with GO](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCV-GifFVIQ1o3t35j1nj-u)
      - [TON with Fift](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCYG-hR4N5FRTKUkfM8POgh)

- Community Channels
  - [TON & Company](https://www.youtube.com/@ton-company/featured) - Ecosystem updates and tutorials.
  - [TON Dev Moscow](https://www.youtube.com/@tondevmoscow/featured) - Developer-focused content.
  - [TON - The Open Network](https://www.youtube.com/@the_open_network/featured) - Official TON channel.
  - [DoraHacks Workshops](https://www.youtube.com/playlist?list=PLpkpEL9gYGez8hCtzMtOabQPX9bgYLZPN) - Hackathon training.

### Community Tutorials
- Smart Contracts
  - [TON Speedrun](https://tonspeedrun.com/) - Interactive learning challenges.
    - [🚩 Challenge 1: Simple NFT Deploy](https://github.com/romanovichim/TONQuest1)
    - [🚩 Challenge 2: Chatbot Contract](https://github.com/romanovichim/TONQuest2)
    - [🚩 Challenge 3: Jetton Vending Machine](https://github.com/romanovichim/TONQuest3)
    - [🚩 Challenge 4: Lottery/Raffle](https://github.com/romanovichim/TONQuest4)
    - [🚩 Challenge 5: Create UI to Interact with the Contract](https://github.com/romanovichim/TONQuest5)
    - [🚩 Challenge 6: Analyzing NFT Sales on Getgems](https://github.com/romanovichim/TONQuest6)
  - [Get Started with TON](https://docs.ton.org/develop/onboarding-challenge) - Official onboarding challenge.
  - [Build Your First DApp on TON](https://docs.tonxapi.com/reference/build-your-first-dapp) - Step-by-step guide.
  - TON Community Hello World Series:
    - [Working with Your First TON Wallet](https://ton-community.github.io/tutorials/01-wallet/)
    - [Writing Your First Smart Contract](https://ton-community.github.io/tutorials/02-contract/)
    - [Building Your First Web Client](https://ton-community.github.io/tutorials/03-client/)
    - [Testing Your First Smart Contract](https://ton-community.github.io/tutorials/04-testing/)
  - [FunC Journey](https://blog.ton.org/func-journey) - Learning FunC programming.
  - FunC Tutorial Series by @romanovichim:
    - [English](https://github.com/romanovichim/TonFunClessons_Eng)
    - [Russian](https://github.com/romanovichim/TonFunClessons_ru)
  - [Wallet Smart Contracts Guide](https://docs.ton.org/develop/smart-contracts/tutorials/wallet) - Implementation tutorial.
  - [Multisig Contract Guide](https://docs.ton.org/develop/smart-contracts/tutorials/multisig) - Creating multisignature wallets.
  - [Rift Framework Tutorial](https://blog.ton.org/rift-announcement) - Python framework for TON.
  - [Multisig with TypeScript](https://docs.ton.org/develop/smart-contracts/tutorials/multisig-js) - JS implementation guide.
  - [Tolk Development Guide](https://github.com/dankorotin/ton-tutorials) - Smart contract development with Tolk.

- FT (Jettons) & NFT
  - [NFT Collection Minting Guide](https://docs.ton.org/develop/dapps/tutorials/collection-minting) - Full NFT deployment.
  - [Jetton Minting Tutorial](https://docs.ton.org/develop/dapps/tutorials/jetton-minter) - Creating fungible tokens.

- Telegram Bot
  - [Storefront Bot with TON Payments](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot) - Building a store.
  - [Bot with Self-managed Balance](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2) - Advanced integration.
  - [Food Delivery Bot Example](https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js) - Real-world application.

- TON Connect
  - [Integration Manual](https://docs.ton.org/develop/dapps/ton-connect/integration) - Standard authentication protocol.
  - [Telegram Bot Integration](https://docs.ton.org/develop/dapps/ton-connect/tg-bot-integration) - Bots with wallet connections.
  - [Transaction Messages](https://docs.ton.org/develop/dapps/ton-connect/transactions) - Handling blockchain interactions.

### Smart Contract Examples
- [Official Smart Contract Examples](https://docs.ton.org/develop/smart-contracts/examples) - Reference implementations.

### Guidelines

- Development Guidelines
  - Smart Contracts
    - [Development Overview](https://docs.ton.org/develop/smart-contracts/guidelines) - Best practices.
  
  - Asset Processing
    - [Payments Processing](https://docs.ton.org/develop/dapps/asset-processing/) - Handling TON transfers.
    - [Jetton Processing](https://docs.ton.org/develop/dapps/asset-processing/jettons) - Working with tokens.
    - [NFT Processing](https://docs.ton.org/develop/dapps/asset-processing/nfts) - Non-fungible token handling.
    - [Metadata Parsing](https://docs.ton.org/develop/dapps/asset-processing/metadata) - Working with on-chain data.
  
  - TON Connect
    - [Developer Guide](https://docs.ton.org/develop/dapps/ton-connect/developers) - Implementation guide.
    - [Wallet Integration](https://docs.ton.org/develop/dapps/ton-connect/protocol/wallet-guidelines) - For wallet developers.
    - [Protocol Workflow](https://docs.ton.org/develop/dapps/ton-connect/protocol/workflow) - Technical specifications.

- API Documentation
  - [Chainstack API Reference](https://docs.chainstack.com/reference/getting-started-ton) - Interactive v2/v3 API docs with examples.

---

## 🧑‍💻 Development

### Dev Tools

- Development Frameworks
  - [Blueprint](https://github.com/ton-community/blueprint/) - Smart contract development environment.
  - [Rift](https://github.com/sky-ring/rift) - Python framework for TON smart contracts.
  - [Tact](https://tact-lang.org/) - High-level language for TON smart contracts.
  - [ton-k8s](https://github.com/disintar/ton-k8s) - Self-hosted TON network with Kubernetes and Docker.

- Testing Tools
  - [Testnet Faucet Bot](https://t.me/testgiver_ton_bot) - Telegram bot for testnet TON.
  - [TONX Testnet Faucet](https://faucet.tonxapi.com/) - Web-based faucet service.
  - [Chainstack TON Faucet](https://faucet.chainstack.com/ton-testnet-faucet) - Daily TON testnet refills.
  - [TON Dev Wallet](https://github.com/TonDevWallet/TonDevWallet) - Developer-focused wallet.

- IDE Support
  - [TON Web IDE](https://ide.ton.org/) - Browser-based IDE designed to simplify the journey of writing, testing, compiling, deploying, and interacting with smart contracts on TON.
  - FunC
    - [VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode) - FunC syntax highlighting and tools.
    - [IntelliJ IDEs Plugin](https://plugins.jetbrains.com/plugin/23382-ton) - TON development for JetBrains IDEs.
    - [Sublime Text Plugin](https://github.com/savva425/func_plugin_sublimetext3) - FunC support for Sublime.
  - Tact
    - [VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact) - Powerful and feature-rich extension for Visual Studio Code (VSCode) and VSCode-based editors like VSCodium, Cursor, Windsurf, and others.
    - [IntelliJ IDEs Plugin](https://plugins.jetbrains.com/plugin/27290-tact) - Powerful and feature-rich plugin for JetBrains IDEs like WebStorm, IntelliJ IDEA, and others.
    - [Sublime Text Plugin](https://github.com/tact-lang/tact-sublime) - Sublime Text 4 package.
    - [tact.vim](https://github.com/tact-lang/tact.vim) - Vim 8+ plugin.
    - [Language Server (LSP Server)](https://github.com/tact-lang/tact-language-server) - Supports Sublime Text, (Neo)Vim, Helix, and other editors with LSP support.

- Debugging
  - [TxTracer](https://txtracer.ton.org) - Tool to emulate and trace any transaction from TON blockchain.

### Libraries & SDKs

- JavaScript/TypeScript
  - [TONX.JS](https://github.com/frigatebird-studio/TONX.js) - JavaScript SDK for TONX API.
  - [ton-core/ton](https://github.com/ton-core/ton) - Cross-platform client by ton-core.
  - [toncenter/tonweb](https://github.com/toncenter/tonweb) - Web client by TonCenter.
  - [orbs-network/ton-access](https://github.com/orbs-network/ton-access) - Decentralized RPC access.
  - [foton](https://github.com/VanishMax/foton) - Comprehensive toolkit for TON dApps.

- Python
  - [disintar/tonpy](https://github.com/disintar/tonpy) - Full-featured SDK with TLB support and TVM.
  - [yungwine/pytoniq](https://github.com/yungwine/pytoniq) - SDK with LiteClient and TLB.
  - [nessshon/tonutils](https://github.com/nessshon/tonutils) - High-level SDK and toolkit.
  - [tonfactory/tonsdk](https://github.com/tonfactory/tonsdk) - Cells and contract wrappers.
  - [toncenter/pytonlib](https://github.com/toncenter/pytonlib) - Python wrapper for Tonlib.
  - [yungwine/TonTools](https://github.com/yungwine/TonTools) - High-level library for HTTP/ADNL.

- Other Languages
  - Go
    - [xssnick/tonutils-go](https://github.com/xssnick/tonutils-go) - Comprehensive Go SDK.
    - [tonkeeper/tongo](https://github.com/tonkeeper/tongo) - Modern Go SDK.
    - [ton-blockchain/tonlib-go](https://github.com/ton-blockchain/tonlib-go) - Official Golang TonLib wrapper.
  - [tonutils-dart](https://github.com/novusnota/tonutils-dart) - Dart/Flutter SDK for mobile apps.
  - [tonlib-rs](https://github.com/ston-fi/tonlib-rs) - Rust SDK for TON.
  - [SwiftyTON](https://github.com/labraburn/SwiftyTON) - Swift SDK with async/await support.
  - [node-tonlib](https://github.com/labraburn/node-tonlib) - Node.js C++ addon for TON.
  - [ton-kotlin](https://github.com/andreypfau/ton-kotlin) - Kotlin SDK for JVM applications.
  - [TonSdk.NET](https://github.com/continuation-team/TonSdk.NET) - C# (.NET, Unity) SDK.

### Community Support

- Developer Communities
  - [TON Overflow](https://answers.ton.org) - Q&A platform for TON developers.
  - [TON Dev Chat](https://t.me/tondev_eng) - English developer community.
  - [TON 开发者社区](https://t.me/tondev_zh) - Chinese developer community.
  - [TON Разработка](https://t.me/tondev) - Russian developer community.

- Documentation Resources
  - [TON Learn](https://docs.ton.org/learn/) - Learning resources and guides.
  - [TON API References](https://docs.ton.org/reference/) - API documentation.

---

## 🔌 Core Integrations

### Authentication
- [TON Connect](https://github.com/ton-connect/) - Standard protocol for dApps and wallets.
- [delab-team/connect](https://github.com/delab-team/connect) - Multi-protocol SDK with unified interface.
- [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk) - JavaScript SDK for TON Connect 2.0.
- [tonutils/tonconnect](https://github.com/nessshon/tonutils?tab=readme-ov-file#ton-connect-integration) - Python SDK for TON Connect.
- [pytonconnect](https://pypi.org/project/pytonconnect/) - Alternative Python SDK.
- [darttonconnect](https://github.com/romanovichim/dartTonconnect) - Dart SDK for mobile apps.

### Telegram Web Apps (TWAs)
- [Official Documentation](https://core.telegram.org/bots/webapps) - Telegram's guidelines.
- [Community Documentation](https://docs.telegram-mini-apps.com/) - Developer community resources.
- [ton-community/twa-template](https://github.com/ton-community/twa-template) - TWA template with TON integration.
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) - Starter boilerplate for TWAs.
- [twa-dev/sdk](https://github.com/twa-dev/sdk) - SDK package for TWA development.
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) - UI library optimized for TWAs.

### API Services
- [TONX API](https://www.notion.so/TONX-TONX-API-TONX-Lab-f9e86e5382604c6193a2ef2243b283fc?pvs=21) - Enterprise-grade API platform.
- [Chainstack](https://chainstack.com/build-better-with-ton/) - Managed RPC nodes with geo balancing.
- [toncenter.com](https://toncenter.com/) - Fast and reliable HTTP API.
- [dton.io/graphql](https://dton.io/graphql) - GraphQL API for TON.
- [tonapi.io](https://tonapi.io/) - Comprehensive API service.
- [anton.tools](https://anton.tools/) - Analytics API tools.

---

## 🛠️ Utilities

- Analytics & Monitoring
  - [TonStat.com](https://www.tonstat.com/) - Key metrics dashboard for TON ecosystem.
  - [Chainstack Compare](https://compare.chainstack.com/dashboard) - Node performance comparison.
  - [TON Grafana](https://tonmon.xyz/) - Blockchain metrics visualization.

- Network Tools
  - [Tonutils Proxy](https://github.com/xssnick/Tonutils-Proxy) - User-friendly TON Proxy implementation.
  - [TON Notify Bot](https://t.me/TONNotifyBot) - Transaction notifications via Telegram.
  - [Blockchain Network Visualizer](https://github.com/qpwedev/blockchain-network-visualizer) - Network visualization tool.

- Staking Services
  - [KTON](https://kton.io/) - Next-Gen Liquid Staking for TON.

- Address Management
  - [vaniton](https://github.com/AntonMeep/vaniton) - Vanity address generator for TON wallets.
  - [custon](https://github.com/TON-NFT/custon) - Custom wallet address generator in JavaScript.
  - [TON Multisender](https://ton.multisender.app/) - Batch transaction tool for TON and Jettons.
  - [TON Bulksender](https://ton.bulksender.app) - Enterprise-grade bulk transaction tool.

- Market Analysis
  - [Anonymous Numbers Market Analytics](https://github.com/qpwedev/anonymous-numbers-market-analytics) - Fragment market statistics.

---

## 🎨 Design Resources

- [TON Design System](https://github.com/designervoid/ton-design-system) - Tailwind-based component library.
- [TON Brand Assets](https://ton.org/brand-assets) - Official logos, colors, and brand guidelines.

---

## 🤝 Contribute
> [Contributing to Awesome-TON](contributing.md)

1. Fork this repository
2. Press `.` on your fork to open the online editor (VSCode)
3. Make your changes following our contribution guidelines
4. Submit a Pull Request with a clear description of your additions/changes
5. Join the TON contributors community!



================================================
FILE: logo/ton_symbol.png
URL: https://github.com/ton-community/awesome-ton/blob/main/logo/ton_symbol.png
================================================
[Binary file blocked: ton_symbol.png]


================================================
FILE: logo/ton_symbol.svg
URL: https://github.com/ton-community/awesome-ton/blob/main/logo/ton_symbol.svg
================================================
[Binary file blocked: ton_symbol.svg]



# Repository: onboarding-sandbox
URL: https://github.com/ton-community/onboarding-sandbox
Branch: main

## Directory Structure:
```
└── onboarding-sandbox/
    ├── README.md
    ├── blockchain-interaction/
        ├── reading-from-blockchain/
            ├── 1-get-account-state.ts
            ├── 2-call-get-method-wrappers.ts
            ├── 2-call-get-method.ts
            ├── 3-fetch-account-transaction.ts
            ├── package.json
        ├── writing-to-blockchain/
            ├── 1-send-ton.ts
            ├── 2-send-jetton.ts
            ├── 3-send-nft.ts
            ├── package.json
    ├── go-exchange-wrapper/
        ├── Makefile
        ├── app/
            ├── main.go
        ├── config/
            ├── config.go
        ├── config.go
        ├── exchange/
            ├── exchange.go
            ├── types/
                ├── close.go
                ├── op-codes.go
                ├── order.go
        ├── go.mod
        ├── go.sum
    ├── metrics/
        ├── metrics.csv
    ├── py-ton-exchange/
        ├── README.md
        ├── py_ton_exchange/
            ├── __init__.py
        ├── pyproject.toml
        ├── src/
            ├── __main__.py
    ├── quick-start/
        ├── clients/
            ├── empty.txt
        ├── smart-contracts/
            ├── Example/
                ├── README.md
                ├── contracts/
                    ├── counter_internal.tact
                    ├── hello_world.fc
                    ├── imports/
                        ├── stdlib.fc
                ├── jest.config.ts
                ├── package.json
                ├── scripts/
                    ├── deployCounterInternal.ts
                    ├── deployHelloWorld.ts
                    ├── incrementCounterInternal.ts
                    ├── incrementHelloWorld.ts
                ├── tests/
                    ├── CounterInternal.spec.ts
                    ├── HelloWorld.spec.ts
                ├── wrappers/
                    ├── CounterInternal.compile.ts
                    ├── CounterInternal.ts
                    ├── HelloWorld.compile.ts
                    ├── HelloWorld.ts
            ├── ExampleTolk/
                ├── README.md
                ├── contracts/
                    ├── counter_internal.tact
                    ├── hello_world.tolk
                ├── jest.config.ts
                ├── package.json
                ├── scripts/
                    ├── deployCounterInternal.ts
                    ├── deployHelloWorld.ts
                    ├── incrementCounterInternal.ts
                    ├── incrementHelloWorld.ts
                ├── tests/
                    ├── CounterInternal.spec.ts
                    ├── HelloWorld.spec.ts
                ├── wrappers/
                    ├── CounterInternal.compile.ts
                    ├── CounterInternal.ts
                    ├── HelloWorld.compile.ts
                    ├── HelloWorld.ts
    ├── sandbox-examples/
        ├── README.md
        ├── contracts/
            ├── distributor.fc
            ├── imports/
                ├── stdlib.fc
        ├── jest.config.ts
        ├── package.json
        ├── tests/
            ├── Distributor/
                ├── Distributor-negative-flow.spec.ts
                ├── Distributor-positive-flow.spec.ts
        ├── wrappers/
            ├── Distributor.compile.ts
            ├── Distributor.ts
    ├── tact-exchange/
        ├── README.md
        ├── contracts/
            ├── ft/
                ├── jetton-minter.fc
                ├── jetton-utils.fc
                ├── jetton-wallet.fc
                ├── op-codes.fc
                ├── params.fc
                ├── stdlib.fc
            ├── imports/
                ├── constants.tact
                ├── jetton.tact
                ├── messages.tact
                ├── stdlib.fc
                ├── types.tact
            ├── order.tact
            ├── order_deployer.tact
        ├── jest.config.ts
        ├── package.json
        ├── scripts/
            ├── deployOrderDeployer.ts
            ├── incrementOrder.ts
        ├── tests/
            ├── OrderDeployer.spec.ts
        ├── wrappers/
            ├── JettonMinter.compile.ts
            ├── JettonMinter.ts
            ├── JettonWallet.compile.ts
            ├── JettonWallet.ts
            ├── Order.compile.ts
            ├── Order.ts
            ├── OrderDeployer.compile.ts
            ├── OrderDeployer.ts
    ├── test-utils/
        ├── common-wrappers/
            ├── JettonMinter.ts
            ├── JettonWallet.ts
            ├── NftCollection.ts
            ├── NftItem.ts
        ├── package.json
    ├── ton-exchange/
        ├── .editorconfig
        ├── .eslintignore
        ├── .eslintrc.json
        ├── README.md
        ├── contracts/
            ├── ft/
                ├── jetton-minter.fc
                ├── jetton-utils.fc
                ├── jetton-wallet.fc
                ├── op-codes.fc
                ├── params.fc
                ├── stdlib.fc
            ├── imports/
                ├── constants.fc
                ├── jetton-utils.fc
                ├── opcodes.fc
                ├── order-asserts.fc
                ├── order-utils.fc
                ├── out-log.fc
                ├── params.fc
                ├── stdlib.fc
                ├── ton-order/
                    ├── fees.fc
                    ├── opcodes.fc
                    ├── utils.fc
                ├── utils.fc
            ├── order.fc
            ├── order_deployer.fc
            ├── ton_order.fc
        ├── jest.config.ts
        ├── package.json
        ├── scripts/
            ├── closeOrder.ts
            ├── closeTonOrderByJetton.ts
            ├── closeTonOrderByTon.ts
            ├── createOrder.ts
            ├── createTonOrder.ts
            ├── createTonOrderByTon.ts
            ├── deployOrderDeployer.ts
            ├── index.ts
        ├── tests/
            ├── OrderDeployer.TonOrder.spec.ts
            ├── OrderDeployer.spec.ts
            ├── TonOrder.spec.ts
        ├── wrappers/
            ├── ExchangeConstants.ts
            ├── JettonMinter.compile.ts
            ├── JettonMinter.ts
            ├── JettonWallet.compile.ts
            ├── JettonWallet.ts
            ├── Order.compile.ts
            ├── Order.ts
            ├── OrderDeployer.compile.ts
            ├── OrderDeployer.ts
            ├── TonOrder.compile.ts
            ├── TonOrder.ts
    ├── tvm-opcodes/
        ├── tvm-spec/
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/README.md
================================================
# onboarding-sandbox



================================================
FILE: blockchain-interaction/reading-from-blockchain/1-get-account-state.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/reading-from-blockchain/1-get-account-state.ts
================================================
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  const accountAddress = Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'); // Replace with any address

  // Calling method on http api
  const state = await tonClient.getContractState(accountAddress);


  console.log('State: ', state.state);
  console.log('Balance: ', state.balance);
  console.log('Data: ', state.data?.toString('hex'));
  console.log('Code: ', state.code?.toString('hex'));
}

main();



================================================
FILE: blockchain-interaction/reading-from-blockchain/2-call-get-method-wrappers.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/reading-from-blockchain/2-call-get-method-wrappers.ts
================================================
import { Address, JettonMaster, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Initializing wrappers
  const jettonMaster = tonClient.open(
    JettonMaster.create(Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')),
  );

  // Calling get method through wrapper
  const address = jettonMaster.getWalletAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));
  console.log(address);
}

main();



================================================
FILE: blockchain-interaction/reading-from-blockchain/2-call-get-method.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/reading-from-blockchain/2-call-get-method.ts
================================================
import { Address, TonClient, TupleBuilder } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Building optional get method parameters list
  const builder = new TupleBuilder();
  builder.writeAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));

  const accountAddress = Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')

  // Calling http api to run get method on specific contract
  const result = await tonClient.runMethod(
    accountAddress, // address to call get method on
    'get_wallet_address', // method name
    builder.build(), // optional params list
  );

  // Deserializing get method result
  const address = result.stack.readAddress();
  console.log(address.toRawString());
}

main();



================================================
FILE: blockchain-interaction/reading-from-blockchain/3-fetch-account-transaction.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/reading-from-blockchain/3-fetch-account-transaction.ts
================================================
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Calling method on http api
  const transactions = await tonClient.getTransactions(
    Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'), // Address to fetch transactions
    {
      limit: 10,
      archival: true,
    },
  );

  const firstTx = transactions[0];
  const { inMessage } = firstTx;

  console.log('Timestamp:', firstTx.now);
  if (inMessage?.info?.type === 'internal') {
    console.log('Value:', inMessage.info.value.coins);
    console.log('Sender:', inMessage.info.src);
  }
}

main();



================================================
FILE: blockchain-interaction/reading-from-blockchain/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/reading-from-blockchain/package.json
================================================
{
  "name": "reading-from-blockchain",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@ton/core": "^0.60.1",
    "@ton/crypto": "^3.3.0",
    "@ton/ton": "^15.2.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2"
  }
}



================================================
FILE: blockchain-interaction/writing-to-blockchain/1-send-ton.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/writing-to-blockchain/1-send-ton.ts
================================================
import { mnemonicToWalletKey } from "@ton/crypto";
import { comment, internal, toNano, TonClient, WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";

async function main() {
  // Initializing tonClient for sending messages to blockchain
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',
  });

  // Using mnemonic to derive public and private keys
  const mnemonic = "lonely kitchen armed visual midnight anchor pottery include force banana mosquito inflict fabric bike leaf differ text coil volcano seed dash amateur black welcome".split(' ');
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);

  // Creating wallet depending on version (v5r1 or v4), uncomment which version do you have
  const walletContract = WalletContractV4.create({ workchain: 0, publicKey });
  // const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey }); // networkGlobalId: -3 for testnet, -239 for mainnet

  // Opening wallet with tonClient, which allows to send messages to blockchain
  const wallet = tonClient.open(walletContract);

  // Retrieving seqno used for replay protection
  const seqno = await wallet.getSeqno();

  // Sending transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: wallet.address, // Transfer will be made to the same wallet address
      body: comment('Hello from wallet!'), // Transfer will contain comment
      value: toNano(0.05), // Amount of TON, attached to transfer
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();



================================================
FILE: blockchain-interaction/writing-to-blockchain/2-send-jetton.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/writing-to-blockchain/2-send-jetton.ts
================================================
import { mnemonicToWalletKey } from "@ton/crypto";
import { Address, beginCell, comment, internal, JettonMaster, toNano, TonClient, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";


async function main() {
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',
  });

  // Using mnemonic to derive public and private keys
  const mnemonic = "word1 word2 ...".split(' ');
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);

  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey }); // networkGlobalId: -3 for testnet, -239 for mainnet

  // Opening wallet with tonClient, which allows to send messages to blockchain
  const wallet = tonClient.open(walletContract);

  // Retrieving seqno used for replay protection
  const seqno = await wallet.getSeqno();

  const jettonTransferBody = beginCell()
    .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
    .storeUint(0, 64) // query id
    .storeCoins(1000000) // jetton amount in minimal values. Note, that USDt has 6 decimals, so 1000000 is 1 USDt on UI
    .storeAddress(wallet.address) // destination address to transfer
    .storeAddress(wallet.address) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(1) // forward amount - if >0, will send notification message
    .storeMaybeRef(comment('Hello from jetton!'))
    .endCell();

  const jettonMasterAddress = Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy'); // If testnet USDt is used this is master address

  const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
  const myJettonWalletAddress = await jettonMaster.getWalletAddress(wallet.address);

  // Sending transfer to jetton wallet
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: myJettonWalletAddress,
      body: jettonTransferBody,
      value: toNano(0.05),
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();



================================================
FILE: blockchain-interaction/writing-to-blockchain/3-send-nft.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/writing-to-blockchain/3-send-nft.ts
================================================
import { mnemonicToWalletKey } from "@ton/crypto";
import { Address, beginCell, comment, internal, JettonMaster, toNano, TonClient, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";


async function main() {
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',
  });
  const mnemonic = "word1 word2 ...".split(' '); // Insert your mnemonic
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);
  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey });
  const wallet = tonClient.open(walletContract);
  const seqno = await wallet.getSeqno();

  const nftTransferBody = beginCell()
    .storeUint(0x5fcc3d14, 32) // opcode for nft transfer
    .storeUint(0, 64) // query id
    .storeAddress(wallet.address) // address to transfer ownership to
    .storeAddress(wallet.address) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(1) // forward amount - if >0, will send notification message
    .storeMaybeRef(comment('Hello from NFT!'))
    .endCell();

  const nftAddress = Address.parse('kQDhZVC5LyJNzS_YPwGMq0zaP7oyqbwuA6oyotd73HbfJSy9'); // NFT Address may be obtained after deploying NFT Item

  // Sending NFT transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: nftAddress,
      body: nftTransferBody,
      value: toNano(0.05),
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();



================================================
FILE: blockchain-interaction/writing-to-blockchain/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/blockchain-interaction/writing-to-blockchain/package.json
================================================
{
  "name": "writing-to-blockchain",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@ton/core": "^0.60.1",
    "@ton/crypto": "^3.3.0",
    "@ton/ton": "^15.2.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2"
  }
}



================================================
FILE: go-exchange-wrapper/Makefile
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/Makefile
================================================
all:
	go build -o ./bin/main app/main.go



================================================
FILE: go-exchange-wrapper/app/main.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/app/main.go
================================================
package main

import (
	"context"
	"log"
	"strings"
	"ton/config"
	"ton/exchange"
	"ton/exchange/types"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

const (
	baseMasterAddress  = "kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl" // VUP
	quoteMasterAddress = "kQCXIMgabnmqaEUspkO0XlSPS4t394YFBlIg0Upygyw3fuSL" // LUP
)

func createJ2JOrder(exch *exchange.Exchange, side types.OrderSide) {
	var order types.J2JOrder
	order.BaseMasterAddress = baseMasterAddress
	order.QuoteMasterAddress = quoteMasterAddress
	order.Side = side
	order.Price = 1
	order.JettonAmount = "1"

	err := exch.CreateJ2JOrder(&order)
	if err != nil {
		log.Fatal(err)
	}
}

func closeJ2JOrder(exch *exchange.Exchange, side types.OrderSide) {
	var close types.J2JClose

	switch side {
	case types.Buy:
		close.MasterAddress = quoteMasterAddress
	case types.Sell:
		close.MasterAddress = baseMasterAddress
	default:
		log.Fatal("wrong order side: ", side)
	}

	close.Side = side
	close.Price = 1
	close.JettonAmount = "1"
	close.OrderAddress = "kQA4fvqAhxmfW_dcgrjXkIZ5IUCpEB871qNoMZcM-_0BGO0I"

	err := exch.CloseJ2JOrder(&close)
	if err != nil {
		log.Fatal(err)
	}
}

// (base/quoat) = (jetton/toncoin)
func createTonOrder(exch *exchange.Exchange, side types.OrderSide) {
	if side == types.Sell {
		var j2tOrder types.J2TOrder
		j2tOrder.JettonAmount = "1.0"
		j2tOrder.MasterAddress = baseMasterAddress
		j2tOrder.Price = 1

		err := exch.CreateJ2TOrder(&j2tOrder)
		if err != nil {
			log.Fatal(err)
		}
		return
	}

	if side == types.Buy {
		var order types.T2JOrder
		order.Amount = "0.5"
		order.MasterAddress = baseMasterAddress
		order.Price = 1

		err := exch.CreateT2JOrder(&order)
		if err != nil {
			log.Fatal(err)
		}
		return
	}
}

// (base/quoat) = (jetton/toncoin)
func closeTonOrder(exch *exchange.Exchange, side types.OrderSide) {
	if side == types.Buy {
		var j2tClose types.J2TClose
		j2tClose.Coins = "0.3"
		j2tClose.OrderAddress = "kQAhznpsLUTSc8oRs7Uy1P_QXNWuLnPwoAgDb8OUpgoXv6py"
		err := exch.CloseJ2TOrder(&j2tClose)
		if err != nil {
			log.Fatal(err)
		}
		return
	}

	if side == types.Sell {
		var close types.T2JClose
		close.MasterAddress = baseMasterAddress
		close.OrderAddress = "kQDNqpY6YfoS88RobJoNfMMFiSSBRtu0Rf56LbkzgSN5P4Bm"
		close.JettonAmount = "0.5"

		err := exch.CloseT2JOrder(&close)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func main() {
	client := liteclient.NewConnectionPool()

	err := client.AddConnectionsFromConfigUrl(context.Background(), config.Testnet)
	if err != nil {
		panic(err)
	}

	ctx := client.StickyContext(context.Background())

	api := ton.NewAPIClient(client)

	words := strings.Split(config.Seedphrase, " ")

	if len(words) != 24 {
		log.Fatal("words: ", len(words))
	}

	v4Wallet, err := wallet.FromSeed(api, words, wallet.V4R2)
	if err != nil {
		log.Fatal("FromSeed err: ", err.Error())
	}

	exch := exchange.NewExchange(v4Wallet, api, ctx, config.DeployerAddress)

	createJ2JOrder(exch, types.Sell)
	closeJ2JOrder(exch, types.Buy)

	// try to sell Jetton for Toncoin
	createTonOrder(exch, types.Sell)
	closeTonOrder(exch, types.Buy)

	// try to buy Jetton for Toncoin
	createTonOrder(exch, types.Buy)
	closeTonOrder(exch, types.Sell)
}



================================================
FILE: go-exchange-wrapper/config.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/config.go
================================================
package config

const (
	Mainnet         = "https://ton.org/global.config.json"
	Testnet         = "https://ton-blockchain.github.io/testnet-global.config.json"
	Seedphrase      = "input your passphrase here"
	DeployerAddress = "kQDOqj1NR4Q5iRQHQCK7Zl2puTDPOTLZ7Db0wnqMZxht-awp"
)



================================================
FILE: go-exchange-wrapper/config/config.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/config/config.go
================================================
package config

const (
	Mainnet         = "https://ton.org/global.config.json"
	Testnet         = "https://ton-blockchain.github.io/testnet-global.config.json"
	Seedphrase      = "input your passphrase here"
	DeployerAddress = "kQDOqj1NR4Q5iRQHQCK7Zl2puTDPOTLZ7Db0wnqMZxht-awp"
)



================================================
FILE: go-exchange-wrapper/exchange/exchange.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/exchange/exchange.go
================================================
package exchange

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"math/big"
	"ton/exchange/types"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

const (
	fwdPayloadAmount = "0.7"
	tonValue         = "1.0"
)

type Exchange struct {
	v4Wallet  *wallet.Wallet
	apiClient *ton.APIClient
	ctx       context.Context

	deployerAddress string
}

func NewExchange(v4Wallet *wallet.Wallet, apiClient *ton.APIClient, ctx context.Context, deployerAddress string) *Exchange {
	return &Exchange{v4Wallet: v4Wallet, apiClient: apiClient, ctx: ctx, deployerAddress: deployerAddress}
}

func (e *Exchange) CreateJ2JOrder(order *types.J2JOrder) error {
	// find our jetton wallet
	var token *jetton.Client
	switch order.Side {
	case types.Buy:
		token = jetton.NewJettonMasterClient(e.apiClient, address.MustParseAddr(order.QuoteMasterAddress))
	case types.Sell:
		token = jetton.NewJettonMasterClient(e.apiClient, address.MustParseAddr(order.BaseMasterAddress))
	default:
		return fmt.Errorf("wrong order side %d", order.Side)
	}

	tokenWallet, err := token.GetJettonWallet(e.ctx, e.v4Wallet.WalletAddress())

	if err != nil {
		return err
	}

	orderPayload := order.ForwardPayload()
	to := address.MustParseAddr(e.deployerAddress)

	body, err := tokenWallet.BuildTransferPayloadV2(to, e.v4Wallet.Address(),
		tlb.MustFromTON(order.JettonAmount),
		tlb.MustFromTON(fwdPayloadAmount), orderPayload, nil)

	if err != nil {
		log.Fatal(err)
	}

	msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON(tonValue), body)

	log.Println("create J2J order...")
	err = e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) CloseJ2JOrder(close *types.J2JClose) error {
	// find our jetton wallet
	token := jetton.NewJettonMasterClient(e.apiClient, address.MustParseAddr(close.MasterAddress))
	tokenWallet, err := token.GetJettonWallet(e.ctx, e.v4Wallet.WalletAddress())

	if err != nil {
		return err
	}

	closePayload := close.ForwardPayload()
	to := address.MustParseAddr(close.OrderAddress)

	body, err := tokenWallet.BuildTransferPayloadV2(to, e.v4Wallet.Address(),
		tlb.MustFromTON(close.JettonAmount),
		tlb.MustFromTON(fwdPayloadAmount), closePayload, nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("log body J2J close: %s\n", body.Dump())

	msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON(tonValue), body)

	log.Println("close J2J order...")
	err = e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) CreateJ2TOrder(order *types.J2TOrder) error {
	// find our jetton wallet
	token := jetton.NewJettonMasterClient(e.apiClient, address.MustParseAddr(order.MasterAddress))
	tokenWallet, err := token.GetJettonWallet(e.ctx, e.v4Wallet.WalletAddress())

	if err != nil {
		return err
	}

	orderPayload := order.ForwardPayload()
	to := address.MustParseAddr(e.deployerAddress)

	body, err := tokenWallet.BuildTransferPayloadV2(to, e.v4Wallet.Address(), tlb.MustFromTON(order.JettonAmount), tlb.MustFromTON(fwdPayloadAmount), orderPayload, nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("log body J2T create: %s\n", body.Dump())

	msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON(tonValue), body)

	log.Println("create J2T order...")
	err = e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) CloseJ2TOrder(close *types.J2TClose) error {
	body := close.Payload(9)

	log.Printf("log body close J2T: %s\n", body.Dump())

	to := address.MustParseAddr(close.OrderAddress)

	sumCoins := new(big.Int)
	sumCoins.Add(tlb.MustFromTON(tonValue).Nano(), tlb.MustFromTON(close.Coins).Nano())

	msg := wallet.SimpleMessage(to, tlb.FromNanoTON(sumCoins), body)

	log.Println("close J2T order...")
	err := e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) CreateT2JOrder(order *types.T2JOrder) error {
	body := order.Payload(9)

	log.Printf("log body create T2J: %s\n", body.Dump())

	to := address.MustParseAddr(e.deployerAddress)

	msg := wallet.SimpleMessage(to, tlb.MustFromTON(tonValue), body)

	log.Println("create T2J order...")
	err := e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) CloseT2JOrder(order *types.T2JClose) error {
	// find our jetton wallet
	token := jetton.NewJettonMasterClient(e.apiClient, address.MustParseAddr(order.MasterAddress))
	tokenWallet, err := token.GetJettonWallet(e.ctx, e.v4Wallet.WalletAddress())

	if err != nil {
		return err
	}

	to := address.MustParseAddr(order.OrderAddress)

	body, err := tokenWallet.BuildTransferPayloadV2(to, e.v4Wallet.Address(), tlb.MustFromTON(order.JettonAmount), tlb.MustFromTON(fwdPayloadAmount), nil, nil)

	if err != nil {
		log.Fatal(err)
	}

	msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON(tonValue), body)

	log.Println("close T2J order...")
	err = e.sendTransaction(msg)

	if err != nil {
		return err
	}

	return nil
}

func (e *Exchange) sendTransaction(msg *wallet.Message) error {
	tx, _, err := e.v4Wallet.SendWaitTransaction(e.ctx, msg)
	if err != nil {
		return err
	}
	log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
	return nil
}



================================================
FILE: go-exchange-wrapper/exchange/types/close.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/exchange/types/close.go
================================================
package types

import (
	"github.com/xssnick/tonutils-go/tvm/cell"
)

type J2JClose struct {
	Side  OrderSide
	Price int

	MasterAddress string
	OrderAddress  string
	JettonAmount  string
}

func (c *J2JClose) ForwardPayload() *cell.Cell {
	return cell.BeginCell().
		MustStoreUInt(uint64(c.Side), 1).
		MustStoreUInt(uint64(c.Price), 32).
		EndCell()
}

type J2TClose struct {
	Coins        string
	OrderAddress string
}

func (c *J2TClose) Payload(query_id uint64) *cell.Cell {
	return cell.BeginCell().
		MustStoreUInt(CloseTonOrder, 32).
		MustStoreUInt(query_id, 64).
		EndCell()
}

type T2JClose struct {
	JettonAmount  string
	OrderAddress  string
	MasterAddress string
}



================================================
FILE: go-exchange-wrapper/exchange/types/op-codes.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/exchange/types/op-codes.go
================================================
package types

const (
	CreateOrder            = 0x26de15e1
	CreateTonOrderByJetton = 0x26de15e2
	CloseTonOrder          = 0x26DE17E4
	CreateTonOrderByTon    = 0x26de17e2
)



================================================
FILE: go-exchange-wrapper/exchange/types/order.go
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/exchange/types/order.go
================================================
package types

import (
	"time"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

type OrderSide = int8

const (
	Sell OrderSide = 0
	Buy  OrderSide = 1
)

type J2JOrder struct {
	BaseMasterAddress  string
	QuoteMasterAddress string
	JettonAmount       string
	Side               OrderSide
	Price              int
}

func (o *J2JOrder) ForwardPayload() *cell.Cell {
	return cell.BeginCell().
		MustStoreUInt(CreateOrder, 32).
		MustStoreAddr(address.MustParseAddr(o.BaseMasterAddress)).
		MustStoreAddr(address.MustParseAddr(o.QuoteMasterAddress)).
		MustStoreUInt(uint64(o.Side), 1).
		MustStoreUInt(uint64(o.Price), 32).
		MustStoreUInt(uint64(time.Now().UTC().Unix()+1000), 64).
		EndCell()
}

// create ton order by jetton
type J2TOrder struct {
	MasterAddress string
	JettonAmount  string
	Price         int
}

func (o *J2TOrder) ForwardPayload() *cell.Cell {
	return cell.BeginCell().
		MustStoreUInt(CreateTonOrderByJetton, 32).
		MustStoreAddr(address.MustParseAddr(o.MasterAddress)).
		MustStoreUInt(uint64(o.Price), 32).
		MustStoreUInt(uint64(time.Now().UTC().Unix()+1000), 64).
		EndCell()
}

// create ton order by toncoin
type T2JOrder struct {
	MasterAddress string
	Amount        string
	Price         int
}

func (o *T2JOrder) Payload(query_id uint64) *cell.Cell {
	return cell.BeginCell().
		MustStoreUInt(CreateTonOrderByTon, 32).
		MustStoreUInt(query_id, 64).
		MustStoreAddr(address.MustParseAddr(o.MasterAddress)).
		MustStoreBigCoins(tlb.MustFromTON(o.Amount).Nano()).
		MustStoreUInt(uint64(o.Price), 32).
		MustStoreUInt(uint64(time.Now().UTC().Unix()+1000), 64).
		EndCell()
}



================================================
FILE: go-exchange-wrapper/go.mod
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/go.mod
================================================
module ton

go 1.21.1

require (
	github.com/oasisprotocol/curve25519-voi v0.0.0-20220328075252-7dd334e3daae // indirect
	github.com/sigurn/crc16 v0.0.0-20211026045750-20ab5afb07e3 // indirect
	github.com/xssnick/tonutils-go v1.9.4 // indirect
	golang.org/x/crypto v0.17.0 // indirect
	golang.org/x/sys v0.15.0 // indirect
)



================================================
FILE: go-exchange-wrapper/go.sum
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/go-exchange-wrapper/go.sum
================================================
github.com/oasisprotocol/curve25519-voi v0.0.0-20220328075252-7dd334e3daae h1:7smdlrfdcZic4VfsGKD2ulWL804a4GVphr4s7WZxGiY=
github.com/oasisprotocol/curve25519-voi v0.0.0-20220328075252-7dd334e3daae/go.mod h1:hVoHR2EVESiICEMbg137etN/Lx+lSrHPTD39Z/uE+2s=
github.com/sigurn/crc16 v0.0.0-20211026045750-20ab5afb07e3 h1:aQKxg3+2p+IFXXg97McgDGT5zcMrQoi0EICZs8Pgchs=
github.com/sigurn/crc16 v0.0.0-20211026045750-20ab5afb07e3/go.mod h1:9/etS5gpQq9BJsJMWg1wpLbfuSnkm8dPF6FdW2JXVhA=
github.com/xssnick/tonutils-go v1.9.4 h1:Wp2/PXFJ1whdWdyMWK0mu8Gm0K93/lCv3blOeicQAeo=
github.com/xssnick/tonutils-go v1.9.4/go.mod h1:p1l1Bxdv9sz6x2jfbuGQUGJn6g5cqg7xsTp8rBHFoJY=
golang.org/x/crypto v0.17.0 h1:r8bRNjWL3GshPW3gkd+RpvzWrZAwPS49OmTGZ/uhM4k=
golang.org/x/crypto v0.17.0/go.mod h1:gCAAfMLgwOJRpTjQ2zCCt2OcSfYMTeZVSRtQlPC7Nq4=
golang.org/x/sys v0.15.0 h1:h48lPFYpsTvQJZF4EKyI4aLHaev3CxivZmv7yZig9pc=
golang.org/x/sys v0.15.0/go.mod h1:/VUhepiaJMQUp4+oa/7Zr1D23ma6VTLIYjOOTFZPUcA=



================================================
FILE: metrics/metrics.csv
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/metrics/metrics.csv
================================================
name,description,value,type,default_value
max_size,maximum external message size in bytes,65535,uint32,65535
max_depth,maximum external message depth,512,uint16,512
max_msg_bits,maximum message size in bits,2097152,uint32,2097152
max_msg_cells,maximum number of cells (a form of storage unit) a message can occupy,8192,uint32,8192
max_vm_data_depth,maximum cell depth in messages and c4 & c5 registers,512,uint16,512
max_actions,maximum amount of actions,256,uint32,256
max_library_cells,maximum number of library cells in library,1000,uint32,1000
max_acc_state_cells,maximum number of cells that an account state can occupy,65536,uint32,65536
max_acc_state_bits,maximum account state size in bits,67043328,uint32,67043328
max_acc_public_libraries,maximum amount of public libraries for account. if account status is uninit and account is on masterchain then 0 else 256,256,uint32,256
free_stack_depth,stack depth without gas consumption,32,enum_value,32
runvm_gas_price,vm start gas consumption,40,enum_value,40
flat_gas_limit,gas below flat_gas_limit is provided at price of flat_gas_price,100,uint64,0
flat_gas_price,costs of launching the TON Virtual Machine,100000,uint64,0
gas_price,price of gas in the network in nanotons per 65536 gas units,65536000,uint64,0
special_gas_limit,limit on the amount of gas that can be consumed per transaction of a special (system) contract,1000000,uint64,0
gas_limit,maximum amount of gas that can be consumed per transaction,1000000,uint64,0
gas_credit,credit in gas units that is provided to transactions for the purpose of checking an external message,10000,uint64,0
block_gas_limit,maximum amount of gas that can be consumed within a single block,10000000,uint64,0
freeze_due_limit,accumulated storage fees (in nanoTON) at which a contract is frozen,100000000,uint64,0
delete_due_limit,accumulated storage fees (in nanoTON) at which a contract is deleted,1000000000,uint64,0
mc_flat_gas_limit,gas below flat_gas_limit is provided at price of flat_gas_price on masterchain,100,uint64,0
mc_flat_gas_price,costs of launching the TON Virtual Machine on masterchain,1000000,uint64,0
mc_gas_price,price of gas in the network in nanotons per 65536 gas units on masterchain,655360000,uint64,0
mc_special_gas_limit,limit on the amount of gas that can be consumed per transaction of a special (system) contract on masterchain,35000000,uint64,0
mc_gas_limit,maximum amount of gas that can be consumed per transaction on masterchain,1000000,uint64,0
mc_gas_credit,credit in gas units that is provided to transactions for the purpose of checking an external message on masterchain,10000,uint64,0
mc_block_gas_limit,maximum amount of gas that can be consumed within a single block on masterchain,2500000,uint64,0
mc_freeze_due_limit,accumulated storage fees (in nanoTON) at which a contract is frozen on masterchain,100000000,uint64,0
mc_delete_due_limit,accumulated storage fees (in nanoTON) at which a contract is deleted on masterchain,1000000000,uint64,0
bytes_underload,limit on the block size in bytes. state when the shard realizes that there is no load and is inclined to merge,131072,uint32,0
bytes_soft_limit,limit on the block size in bytes. when this limit is reached internal messages stop being processed,524288,uint32,0
bytes_hard_limit,absolute maximum bytes size of block,1048576,uint32,0
gas_underload,limit on the block size in gas. state when the shard realizes that there is no load and is inclined to merge,2000000,uint32,0
gas_soft_limit,limit on the block size in gas. when this limit is reached internal messages stop being processed,10000000,uint32,0
gas_hard_limit,absolute maximum gas of block,20000000,uint32,0
lt_delta_underload,limits on the difference in logical time between the first and the last transaction. state when the shard realizes that there is no load and is inclined to merge,1000,uint32,0
lt_delta_soft_limit,limits on the difference in logical time between the first and the last transaction. when this limit is reached internal messages stop being processed,5000,uint32,0
lt_delta_hard_limit,absolute maximum difference in logical time between the first and the last transaction of block,10000,uint32,0
mc_bytes_underload,limit on the block size in bytes. state when the shard realizes that there is no load and is inclined to merge on masterchain,131072,uint32,0
mc_bytes_soft_limit,limit on the block size in bytes. when this limit is reached internal messages stop being processed on masterchain,524288,uint32,0
mc_bytes_hard_limit,absolute maximum bytes size of block on masterchain,1048576,uint32,0
mc_gas_underload,limit on the block size in gas. state when the shard realizes that there is no load and is inclined to merge on masterchain,200000,uint32,0
mc_gas_soft_limit,limit on the block size in gas. when this limit is reached internal messages stop being processed on masterchain,1000000,uint32,0
mc_gas_hard_limit,absolute maximum gas of block on masterchain,2500000,uint32,0
mc_lt_delta_underload,limits on the difference in logical time between the first and the last transaction. state when the shard realizes that there is no load and is inclined to merge on masterchain,1000,uint32,0
mc_lt_delta_soft_limit,limits on the difference in logical time between the first and the last transaction. when this limit is reached internal messages stop being processed on masterchain,5000,uint32,0
mc_lt_delta_hard_limit,absolute maximum difference in logical time between the first and the last transaction of block on masterchain,10000,uint32,0
lump_price,"base price for forwarding a message, regardless of its size or complexity",400000,uint64,0
bit_price,cost per 65536 bit of message forwarding,26214400,uint64,0
cell_price,cost per 65536 cells of message forwarding,2621440000,uint64,0
ihr_factor,factor used to calculate the cost of immediate hypercube routing (IHR),98304,uint32,0
first_frac,fraction of the remaining remainder that will be used for the first transition along the message route,21845,uint32,0
next_frac,fraction of the remaining remainder that will be used for subsequent transitions along the message route,21845,uint32,0
mc_lump_price,"base price for forwarding a message, regardless of its size or complexity on masterchain",10000000,uint64,0
mc_bit_price,cost per 65536 bit of message forwarding on masterchain,655360000,uint64,0
mc_cell_price,cost per 65536 cells of message forwarding on masterchain,65536000000,uint64,0
mc_ihr_factor,factor used to calculate the cost of immediate hypercube routing (IHR) on masterchain,98304,uint32,0
mc_first_frac,fraction of the remaining remainder that will be used for the first transition along the message route on masterchain,21845,uint32,0
mc_next_frac,fraction of the remaining remainder that will be used for subsequent transitions along the message route on masterchain,21845,uint32,0
utime_since,initial Unix timestamp from which the specified prices apply,0,UnixTime,0
bit_price_ps,storage price for one bit for 65536 seconds,1,uint64,1
cell_price_ps,storage price for one cell bit for 65536 seconds,500,uint64,500
mc_bit_price_ps,masterchain storage price for one bit for 65536 seconds,1000,uint64,1000
mc_cell_price_ps,masterchain storage price for one cell bit for 65536 seconds,500000,uint64,500000
mc_catchain_lifetime,lifetime of masterchain catchain groups in seconds,250,uint32,200
shard_catchain_lifetime,lifetime of shardchain catchain groups in seconds,250,uint32,200
shard_validators_lifetime,lifetime of a shardchain validators group in seconds,1000,uint32,3000
shard_validators_num,number of validators in each shardchain validation group,23,uint32,7
masterchain_block_fee,reward for block creation in the TON Blockchain,1700000000,Grams,0
basechain_block_fee,number of validators in each shardchain validation group,1000000000,Grams,0



================================================
FILE: py-ton-exchange/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/py-ton-exchange/README.md
================================================



================================================
FILE: py-ton-exchange/py_ton_exchange/__init__.py
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/py-ton-exchange/py_ton_exchange/__init__.py
================================================



================================================
FILE: py-ton-exchange/pyproject.toml
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/py-ton-exchange/pyproject.toml
================================================
[tool.poetry]
name = "py-ton-exchange"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]
readme = "README.md"
packages = [ { include = "src" } ]

[tool.poetry.dependencies]
python = "^3.12"
pytoniq = "^0.1.35"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"


[tool.poetry.scripts]
app = "src.__main__:main"


================================================
FILE: py-ton-exchange/src/__main__.py
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/py-ton-exchange/src/__main__.py
================================================
import asyncio
from typing import AsyncGenerator, Literal, Optional

from pytoniq_core import Address, Cell, begin_cell
from pytoniq import LiteBalancer
import time

import contextlib

from pytoniq.contract.wallets.wallet import WalletV4R2


ORDER_DEPLOYER_ADDRESS = "EQBuObr2M7glm08w6cBGjIuuCbmvBFGwuVs6qb3AQpac9Xpf"
BASE_MASTER_ADDRESS = Address("kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl")
QUOTE_MASTER_ADDRESS = "kQCXIMgabnmqaEUspkO0XlSPS4t394YFBlIg0Upygyw3fuSL"
JETTON_WALLET_ADDRESS = "kQDkPYFZC9w6h-_wZCZ959XBCv6IdLEFWMMqHTLcHFRc4_YH"
JETTON_MASTER_ADDRESS = "kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl"

mnemonics = "your mnemonics here"


async def create_ton_order(wallet: WalletV4R2, side: Literal["buy", "sell"]):
    match side:
        case "buy":
            await _create_jetton_to_ton(
                wallet=wallet, via=BASE_MASTER_ADDRESS, amount=1, price=1
            )

        case "sell":
            await _create_ton_to_jetton(
                wallet=wallet, via=BASE_MASTER_ADDRESS, amount=1, price=1
            )

        case unknown:
            raise ValueError(f"Unknown order side: {unknown}")


async def _create_jetton_to_ton(
    wallet: WalletV4R2, via: Address, amount: int, price: int
):
    pass


async def _create_ton_to_jetton(
    wallet: WalletV4R2, via: Address, amount: int, price: int
):
    pass


async def _create_ton_order_by_ton(wallet: WalletV4R2, via: Address, value: int):
    body = (
        begin_cell()
        .store_uint(0x26DE17E2, 32)
        .store_uint(0, 64)
        .store_address(JETTON_MASTER_ADDRESS)
        .store_coins(1)
        .store_uint(3, 32)
        .store_uint(0, 64)
        .end_cell()
    )

    message = wallet.create_wallet_internal_message(
        destination=via,
        value=value,
        body=body,
    )

    await wallet.raw_transfer([message])


async def close_ton_order_by_ton():
    async with lite_balancer() as provider:
        wallet = await WalletV4R2.from_mnemonic(provider, mnemonics)
        assert isinstance(wallet, WalletV4R2)
        await _close_ton_order_by_ton(
            wallet=wallet,
            via=Address("EQByxhbOkRKssQTSjnZOYNvl9T3IYqmDPvbGiwhaqrR4Mdbz"),
            value=int(0.015 * 1e9),
            query_id=5,
        )


async def _close_ton_order_by_ton(
    wallet: WalletV4R2, via: Address, value: int, query_id: int
):
    body = begin_cell().store_uint(0x26DE17E4, 32).store_uint(query_id, 64).end_cell()

    message = wallet.create_wallet_internal_message(
        destination=via, value=value, body=body
    )

    await wallet.raw_transfer([message])


async def create_ton_order_by_jetton():
    price = 1
    async with lite_balancer() as provider:
        wallet = await WalletV4R2.from_mnemonic(provider, mnemonics)
        assert isinstance(wallet, WalletV4R2)
        await _create_ton_order_by_jetton(
            wallet=wallet,
            via=Address("EQByxhbOkRKssQTSjnZOYNvl9T3IYqmDPvbGiwhaqrR4Mdbz"),
            value=price,
            to_address=Address("EQByxhbOkRKssQTSjnZOYNvl9T3IYqmDPvbGiwhaqrR4Mdbz"),
            query_id=9,
            forward_amount=5,
            jetton_amount=2,
            forward_payload=(
                begin_cell()
                .store_uint(0x26DE15E2, 32)
                .store_address(JETTON_MASTER_ADDRESS)
                .store_uint(price, 32)
                .store_uint(int(time.time()), 64)
                .end_cell()
            ),
        )


async def _create_ton_order_by_jetton(
    wallet: WalletV4R2,
    via: Address,
    value: int,
    to_address: Address,
    query_id: int,
    forward_amount: int,
    jetton_amount: int,
    forward_payload: Optional[Cell] = None,
):

    body = (
        begin_cell()
        .store_uint(0xF8A7EA5, 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_address(to_address)
        .store_address(via)
        .store_uint(0, 1)
        .store_coins(forward_amount)
        .store_maybe_ref(forward_payload)
        .end_cell()
    )

    message = wallet.create_wallet_internal_message(
        destination=via, value=value, body=body
    )

    await wallet.raw_transfer([message])


async def close_ton_order_by_jetton():
    pass


async def _close_ton_order_by_jetton():
    pass


@contextlib.asynccontextmanager
async def lite_balancer() -> AsyncGenerator[LiteBalancer, None]:
    balancer = LiteBalancer.from_testnet_config(trust_level=2)
    await balancer.start_up()
    yield balancer
    await balancer.close_all()


async def _main():
    async with lite_balancer() as provider:
        wallet = await WalletV4R2.from_mnemonic(provider, mnemonics)
        assert isinstance(wallet, WalletV4R2)

        await create_ton_order(wallet, "buy")
        await create_ton_order(wallet, "sell")


def main():
    asyncio.run(_main())



================================================
FILE: quick-start/clients/empty.txt
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/clients/empty.txt
================================================



================================================
FILE: quick-start/smart-contracts/Example/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/README.md
================================================
# Example

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: quick-start/smart-contracts/Example/contracts/counter_internal.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/contracts/counter_internal.tact
================================================
import "@stdlib/deploy";
import "@stdlib/ownable";

message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract CounterInternal with Ownable, Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    owner: Address;

    init(id: Int, owner: Address) {
        self.id = id;
        self.counter = 0;
        self.owner = owner;
    }

    receive(msg: Add) {
        self.requireOwner();
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}



================================================
FILE: quick-start/smart-contracts/Example/contracts/hello_world.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/contracts/hello_world.fc
================================================
#include "imports/stdlib.fc";

const op::increase = "op::increase"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case
const op::send_increase = "op::send_increase"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case

(int, int, int) load_data() {
    var ds = get_data().begin_parse();

    int ctx_id = ds~load_uint(32);
    int ctx_counter = ds~load_uint(32);
    int ctx_counter_ext = ds~load_uint(256);

    ds.end_parse();

    return (ctx_id, ctx_counter, ctx_counter_ext);
}

() save_data(int ctx_id, int ctx_counter, int ctx_counter_ext) impure {
    set_data(
        begin_cell()
            .store_uint(ctx_id, 32)
            .store_uint(ctx_counter, 32)
            .store_uint(ctx_counter_ext, 256)
        .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore all empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data(); ;; here we populate the storage variables

    int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op
    int query_id = in_msg_body~load_uint(64); ;; also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data(ctx_id, ctx_counter, ctx_counter_ext);
        return ();
    }

    throw(0xffff); ;; if the message contains an op that is not known to this contract, we throw
}

() recv_external(slice in_msg) impure {
    accept_message();

    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data();

    var query_id = in_msg~load_uint(64);
    var addr = in_msg~load_msg_addr();
    var coins = in_msg~load_coins();
    var increase_by = in_msg~load_uint(32);

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(coins)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::increase, 32)
        .store_uint(query_id, 64)
        .store_uint(increase_by, 32);
    send_raw_message(msg.end_cell(), 0);

    ctx_counter_ext += increase_by;
    save_data(ctx_id, ctx_counter, ctx_counter_ext);

    return ();
}

;; get methods are a means to conveniently read contract data using, for example, HTTP APIs
;; they are marked with method_id
;; note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

int get_counter() method_id {
    var (_, ctx_counter, _) = load_data();
    return ctx_counter;
}

int get_id() method_id {
    var (ctx_id, _, _) = load_data();
    return ctx_id;
}

(int, int) get_counters() method_id {
    var (_, ctx_counter, ctx_counter_ext) = load_data();
    return (ctx_counter, ctx_counter_ext);
}



================================================
FILE: quick-start/smart-contracts/Example/contracts/imports/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
    This file is part of TON FunC Standard Library.

    FunC Standard Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    FunC Standard Library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

-}

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm(-> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
;;() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm(-> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

{- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm(-> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm(-> 1 0) "LDVARUINT16";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm(-> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm(-> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STVARUINT16";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm(-> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slices_bits(slice a, slice b) asm "SDEQ";
;;; Checks whether b is a null. Note, that FunC also has polymorphic null? built-in.
int builder_null?(builder b) asm "ISNULL";
;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

int gas_consumed() asm "GASCONSUMED";

;; TVM V6 https://github.com/ton-blockchain/ton/blob/testnet/doc/GlobalVersions.md#version-6

int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int get_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEE";
int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";

int get_simple_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEESIMPLE";
int get_simple_forward_fee(int workchain, int bits, int cells) asm(cells bits workchain) "GETFORWARDFEESIMPLE";
int get_original_fwd_fee(int workchain, int fwd_fee) asm(fwd_fee workchain) "GETORIGINALFWDFEE";
int my_storage_due() asm "DUEPAYMENT";

tuple get_fee_cofigs() asm "UNPACKEDCONFIGTUPLE";

;; BASIC

const int TRUE = -1;
const int FALSE = 0;

const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;;; skip (Maybe ^Cell) from `slice` [s].
(slice, ()) ~skip_maybe_ref(slice s) asm "SKIPOPTREF";

(slice, int) ~load_bool(slice s) inline {
    return s.load_int(1);
}

builder store_bool(builder b, int value) inline {
    return b.store_int(value, 1);
}

;; ADDRESS NONE
;; addr_none$00 = MsgAddressExt; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L100

builder store_address_none(builder b) inline {
    return b.store_uint(0, 2);
}

slice address_none() asm "<b 0 2 u, b> <s PUSHSLICE";

int is_address_none(slice s) inline {
    return s.preload_uint(2) == 0;
}

;; MESSAGE

;; The message header info is organized as follows:

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L126
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddressInt dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfo;

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L135
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
;; src:MsgAddress dest:MsgAddressInt
;; value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
;; created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;


;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L123C1-L124C33
;; currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;

;; MSG FLAGS

const int BOUNCEABLE = 0x18; ;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const int NON_BOUNCEABLE = 0x10; ;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00

;; store msg_flags and address none
builder store_msg_flags_and_address_none(builder b, int msg_flags) inline {
    return b.store_uint(msg_flags, 6);
}

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) inline {
    return s.load_uint(4);
}
;;; @param `msg_flags` - 4-bit
int is_bounced(int msg_flags) inline {
    return msg_flags & 1 == 1;
}

(slice, ()) ~skip_bounced_prefix(slice s) inline {
    return (s.skip_bits(32), ()); ;; skip 0xFFFFFFFF prefix
}

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS = 1 + 4 + 4 + 64 + 32;

;; MSG

;; https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L155
;; message$_ {X:Type} info:CommonMsgInfo
;;  init:Maybe (Either StateInit ^StateInit)
;;  body:(Either X ^X) = Message X;
;;
;;message$_ {X:Type} info:CommonMsgInfoRelaxed
;;  init:(Maybe (Either StateInit ^StateInit))
;;  body:(Either X ^X) = MessageRelaxed X;
;;
;;_ (Message Any) = MessageAny;

;; if have StateInit (always place StateInit in ref):
;; 0b11 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1 + 1;
const int MSG_HAVE_STATE_INIT = 4;
const int MSG_STATE_INIT_IN_REF = 2;
const int MSG_BODY_IN_REF = 1;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE = MSG_INFO_REST_BITS + 1 + 1;

builder store_statinit_ref_and_body_ref(builder b, cell state_init, cell body) inline {
    return b
    .store_uint(MSG_HAVE_STATE_INIT + MSG_STATE_INIT_IN_REF + MSG_BODY_IN_REF, MSG_WITH_STATE_INIT_AND_BODY_SIZE)
    .store_ref(state_init)
    .store_ref(body);
}

builder store_only_body_ref(builder b, cell body) inline {
    return b
    .store_uint(MSG_BODY_IN_REF, MSG_ONLY_BODY_SIZE)
    .store_ref(body);
}

builder store_prefix_only_body(builder b) inline {
    return b
    .store_uint(0, MSG_ONLY_BODY_SIZE);
}

;; parse after sender_address
(slice, int) ~retrieve_fwd_fee(slice in_msg_full_slice) inline {
    in_msg_full_slice~load_msg_addr(); ;; skip dst
    in_msg_full_slice~load_coins(); ;; skip value
    in_msg_full_slice~skip_dict(); ;; skip extracurrency collection
    in_msg_full_slice~load_coins(); ;; skip ihr_fee
    int fwd_fee = in_msg_full_slice~load_coins();
    return (in_msg_full_slice, fwd_fee);
}

;; MSG BODY

;; According to the guideline, it is recommended to start the body of the internal message with uint32 op and uint64 query_id

const int MSG_OP_SIZE = 32;
const int MSG_QUERY_ID_SIZE = 64;

(slice, int) ~load_op(slice s) inline {
    return s.load_uint(MSG_OP_SIZE);
}
(slice, ()) ~skip_op(slice s) inline {
    return (s.skip_bits(MSG_OP_SIZE), ());
}
builder store_op(builder b, int op) inline {
    return b.store_uint(op, MSG_OP_SIZE);
}

(slice, int) ~load_query_id(slice s) inline {
    return s.load_uint(MSG_QUERY_ID_SIZE);
}
(slice, ()) ~skip_query_id(slice s) inline {
    return (s.skip_bits(MSG_QUERY_ID_SIZE), ());
}
builder store_query_id(builder b, int query_id) inline {
    return b.store_uint(query_id, MSG_QUERY_ID_SIZE);
}

(slice, (int, int)) ~load_op_and_query_id(slice s) inline {
    int op = s~load_op();
    int query_id = s~load_query_id();
    return (s, (op, query_id));
}

;; SEND MODES - https://docs.ton.org/tvm.pdf page 137, SENDRAWMSG

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int SEND_MODE_REGULAR = 0;
;;; +1 means that the sender wants to pay transfer fees separately.
const int SEND_MODE_PAY_FEES_SEPARATELY = 1;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int SEND_MODE_IGNORE_ERRORS = 2;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int SEND_MODE_DESTROY = 32;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int SEND_MODE_CARRY_ALL_BALANCE = 128;
;;; in the case of action fail - bounce transaction. No effect if SEND_MODE_IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_BOUNCE_ON_ACTION_FAIL = 16;

;; Only for `send_message`:

;;; do not create an action, only estimate fee. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int SEND_MODE_ESTIMATE_FEE_ONLY = 1024;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; RESERVE MODES - https://docs.ton.org/tvm.pdf page 137, RAWRESERVE

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

;; TOKEN METADATA
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte
(cell, ()) ~set_token_snake_metadata_entry(cell content_dict, int key, slice value) impure {
    content_dict~udict_set_ref(256, key, begin_cell().store_uint(0, 8).store_slice(value).end_cell());
    return (content_dict, ());
}

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline {
    return begin_cell().store_uint(0, 8).store_dict(content_dict).end_cell();
}



================================================
FILE: quick-start/smart-contracts/Example/jest.config.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: quick-start/smart-contracts/Example/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/package.json
================================================
{
    "name": "Example",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.29.0",
        "@ton/sandbox": "^0.27.1",
        "@ton/test-utils": "^0.5.0",
        "@types/jest": "^29.5.14",
        "@types/node": "^22.13.8",
        "jest": "^29.7.0",
        "prettier": "^3.5.2",
        "@ton/ton": "^15.2.1",
        "@ton/core": "~0",
        "@ton/crypto": "^3.3.0",
        "ts-jest": "^29.2.6",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.2",
        "@ton/tolk-js": "^0.8.0",
        "@tact-lang/compiler": "^1.6.2",
        "@ton-community/func-js": "^0.9.1"
    }
}



================================================
FILE: quick-start/smart-contracts/Example/scripts/deployCounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/scripts/deployCounterInternal.ts
================================================
import { toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const counterInternal = provider.open(
        await CounterInternal.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            Address.parse("kQDW2lkFHPO_EWAsWI90MdvqU5fr8tiELbbcfaA8FmSkMVJ8") //just a random address
        ),
    );

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counterInternal.address);

    console.log('ID', await counterInternal.getId());
}



================================================
FILE: quick-start/smart-contracts/Example/scripts/deployHelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/scripts/deployHelloWorld.ts
================================================
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { CounterInternal } from '../wrappers/CounterInternal';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const helloWorld = provider.open(
        HelloWorld.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                ctxCounter: 0,
                ctxCounterExt: 0n,
            },
            await compile('HelloWorld')
        )
    );

    await helloWorld.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(helloWorld.address);

    const counterInternal = provider.open(
        await CounterInternal.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            helloWorld.address
        )
    );

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counterInternal.address);

    console.log('ID', await helloWorld.getID());
    console.log('ID', (await counterInternal.getId()).toString());
}



================================================
FILE: quick-start/smart-contracts/Example/scripts/incrementCounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/scripts/incrementCounterInternal.ts
================================================
import { Address, toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('CounterInternal address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const counterInternal = provider.open(CounterInternal.fromAddress(address));

    const counterBefore = await counterInternal.getCounter();

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await counterInternal.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await counterInternal.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}



================================================
FILE: quick-start/smart-contracts/Example/scripts/incrementHelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/scripts/incrementHelloWorld.ts
================================================
import { Address, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('HelloWorld address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const helloWorld = provider.open(HelloWorld.createFromAddress(address));

    const counterBefore = await helloWorld.getCounter();

    await helloWorld.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.05'),
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await helloWorld.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await helloWorld.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}



================================================
FILE: quick-start/smart-contracts/Example/tests/CounterInternal.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/tests/CounterInternal.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('CounterInternal', () => {
    let codeHelloWorld: Cell;
    let blockchain: Blockchain;
    let counterInternal: SandboxContract<CounterInternal>;
    let deployerCounter: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        codeHelloWorld = await compile('HelloWorld');
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployerCounter = await blockchain.treasury('deployerCounter');

        // Deploy CounterInternal with HelloWorld as the owner
        counterInternal = blockchain.openContract(
            await CounterInternal.fromInit(0n, deployerCounter.address)
        );

        const deployResultCounter = await counterInternal.send(deployerCounter.getSender(), { value: toNano('1.00') }, {
            $$type: 'Deploy',
            queryId: 0n
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployerCounter.address,
            to: counterInternal.address,
            deploy: true,
            success: true
        });
    });

    it('should fail if not owner call increment', async () => {
        // Verify owner is correctly set to HelloWorld
        const ownerAddress = await counterInternal.getOwner();
        expect(ownerAddress.equals(deployerCounter.address)).toBe(true);

        // Get initial counter value
        const counterBefore = await counterInternal.getCounter();

        // Try to increase counter from a non-owner account (should fail)
        const nonOwner = await blockchain.treasury('nonOwner');
        const increaseBy = 5n;

        const nonOwnerResult = await counterInternal.send(nonOwner.getSender(), {
            value: toNano('0.05')
        }, {
            $$type: 'Add',
            amount: increaseBy,
            queryId: 0n
        });

        // This should fail since only the owner should be able to increment
        expect(nonOwnerResult.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: counterInternal.address,
            success: false,
            exitCode: 132 // The error code thrown in the contract, Access Denied
        });

        // Counter should remain unchanged
        const counterAfterNonOwner = await counterInternal.getCounter();
        expect(counterAfterNonOwner).toBe(counterBefore);
    });
});



================================================
FILE: quick-start/smart-contracts/Example/tests/HelloWorld.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/tests/HelloWorld.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should correctly initialize and return the initial data', async () => {
        // Define the expected initial values (same as in beforeEach)
        const expectedConfig = {
            id: 0,
            counter: 0,
            counterExt: 0n
        };

        // Log the initial configuration values before verification
        console.log('Initial configuration values (before deployment):');
        console.log('- ID:', expectedConfig.id);
        console.log('- Counter:', expectedConfig.counter);
        console.log('- CounterExt:', expectedConfig.counterExt);

        console.log('Retrieved values after deployment:');
        // Verify counter value
        const counter = await helloWorld.getCounter();
        console.log('- Counter:', counter);
        expect(counter).toBe(expectedConfig.counter);

        // Verify ID value
        const id = await helloWorld.getID();
        console.log('- ID:', id);
        expect(id).toBe(expectedConfig.id);

        // Verify counterExt
        const [_, counterExt] = await helloWorld.getCounters();
        console.log('- CounterExt', counterExt);
        expect(counterExt).toBe(expectedConfig.counterExt);
    });

    it('should send an external message and update counter', async () => {
        const receiver = await blockchain.treasury('receiver');

        const receiverBalanceBefore = await receiver.getBalance();
        const [__, counterExtBefore] = await helloWorld.getCounters()
        const increase = 5;

        const result = await helloWorld.sendExternalIncrease({
            increaseBy: increase,
            value: toNano(0.05),
            addr: receiver.address,
            queryID: 0
        });

        expect(result.transactions).toHaveTransaction({
            from: undefined, // External messages have no 'from' address
            to: helloWorld.address,
            success: true,
        });

        expect(result.transactions).toHaveTransaction({
            from: helloWorld.address,
            to: receiver.address,
            success: true,
        });

        const receiverBalanceAfter = await receiver.getBalance();

        expect(receiverBalanceAfter).toBeGreaterThan(receiverBalanceBefore);
        const [_, counterExt] = await helloWorld.getCounters()
        expect(counterExtBefore + BigInt(increase)).toBe(counterExt);
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await helloWorld.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await helloWorld.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: helloWorld.address,
                success: true,
            });

            const counterAfter = await helloWorld.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});





================================================
FILE: quick-start/smart-contracts/Example/wrappers/CounterInternal.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/wrappers/CounterInternal.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/counter_internal.tact',
    options: {
        debug: true,
    },
};



================================================
FILE: quick-start/smart-contracts/Example/wrappers/CounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/wrappers/CounterInternal.ts
================================================
export * from '../build/CounterInternal/tact_CounterInternal';



================================================
FILE: quick-start/smart-contracts/Example/wrappers/HelloWorld.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/wrappers/HelloWorld.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/hello_world.fc'],
};



================================================
FILE: quick-start/smart-contracts/Example/wrappers/HelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/Example/wrappers/HelloWorld.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from '@ton/core';
import { sign } from '@ton/crypto'


export type HelloWorldConfig = {
    id: number;
    ctxCounter: number;
    ctxCounterExt: bigint;
};
export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.ctxCounter, 32)
        .storeUint(config.ctxCounterExt, 256)
    .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class HelloWorld implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    static createFromConfig(config: HelloWorldConfig, code: Cell, workchain = 0) {
        const data = helloWorldConfigToCell(config);
        const init = { code, data };
        return new HelloWorld(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async sendExternalIncrease(
        provider: ContractProvider,
        opts: {
            increaseBy: number;
            value: bigint;
            addr: Address;
            queryID?: number;
        }
    ) {
        const message = beginCell()
            .storeUint(opts.queryID ?? 0, 64)
            .storeAddress(opts.addr)
            .storeCoins(opts.value)
            .storeUint(opts.increaseBy, 32)
        .endCell()

        return await provider.external(message);
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getCounters(provider: ContractProvider) : Promise<[number, bigint]> {
        const result = await provider.get('get_counters', []);
        const ctxCounter = result.stack.readNumber();
        const ctxCounterExt = result.stack.readBigNumber();

        return [ctxCounter, ctxCounterExt]
    }
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/README.md
================================================
# ExampleTolk

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: quick-start/smart-contracts/ExampleTolk/contracts/counter_internal.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/contracts/counter_internal.tact
================================================
import "@stdlib/deploy";
import "@stdlib/ownable";

message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract CounterInternal with Ownable, Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    owner: Address;

    init(id: Int, owner: Address) {
        self.id = id;
        self.counter = 0;
        self.owner = owner;
    }

    receive(msg: Add) {
        self.requireOwner();
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/contracts/hello_world.tolk
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/contracts/hello_world.tolk
================================================
// simple counter contract in Tolk language

const OP_INCREASE = 0x7e8764ef;  // arbitrary 32-bit number, equal to OP_INCREASE in wrappers/CounterContract.ts

// load_data retrieves variables from TVM storage cell
// impure because of writting into global variables
fun loadData(): (int, int, int) {
    var ds = getContractData().beginParse();

    // id is required to be able to create different instances of counters
    // since addresses in TON depend on the initial state of the contract
    var ctxID = ds.loadUint(32);
    var ctxCounter = ds.loadUint(32);
    var ctxCounterExt = ds.loadUint(256);

    ds.assertEndOfSlice();

    return (ctxID, ctxCounter, ctxCounterExt);
}

// saveData stores storage variables as a cell into persistent storage
fun saveData(ctxID: int, ctxCounter: int, ctxCounterExt: int) {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .storeUint(ctxCounterExt, 256)
        .endCell()
    );
}

// onInternalMessage is the main entrypoint; it's called when a contract receives an internal message from other contracts
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    if (msgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) { // ignore all bounced messages
        return;
    }

    var (ctxID, ctxCounter, ctxCounterExt) = loadData(); // here we populate the storage variables

    val op = msgBody.loadMessageOp(); // by convention, the first 32 bits of incoming message is the op
    val queryID = msgBody.loadMessageQueryId(); // also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == OP_INCREASE) {
        val increaseBy = msgBody.loadUint(32);
        ctxCounter += increaseBy;
        saveData(ctxID, ctxCounter, ctxCounterExt);
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

fun acceptExternalMessage(): void
    asm "ACCEPT";

fun onExternalMessage(inMsg: slice) {
    acceptExternalMessage();
    var (ctxId, ctxCounter, ctxCounterExt) = loadData();

    var queryId = inMsg.loadUint(64);
    var addr = inMsg.loadAddress();
    var coins = inMsg.loadCoins();
    var increaseBy = inMsg.loadUint(32);

    var msg = beginCell()
        .storeUint(0x18, 6)
        .storeSlice(addr)
        .storeCoins(coins)
        .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeUint(OP_INCREASE, 32)
        .storeUint(queryId, 64)
        .storeUint(increaseBy, 32);
    sendRawMessage(msg.endCell(), 0);

    ctxCounterExt += increaseBy;
    saveData(ctxId, ctxCounter, ctxCounterExt);

    return ();
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get get_counter(): int {
    var (_, ctxCounter, _) = loadData();
    return ctxCounter;
}

get get_id(): int {
    var (ctxID, _, _) = loadData();
    return ctxID;
}

get get_counters(): (int, int) {
    var (_, ctxCounter, ctxCounterExt) = loadData();
    return (ctxCounter, ctxCounterExt);
}




================================================
FILE: quick-start/smart-contracts/ExampleTolk/jest.config.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: quick-start/smart-contracts/ExampleTolk/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/package.json
================================================
{
    "name": "ExampleTolk",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.29.0",
        "@ton/sandbox": "^0.27.1",
        "@ton/test-utils": "^0.5.0",
        "@types/jest": "^29.5.14",
        "@types/node": "^22.13.8",
        "jest": "^29.7.0",
        "prettier": "^3.5.2",
        "@ton/ton": "^15.2.1",
        "@ton/core": "~0",
        "@ton/crypto": "^3.3.0",
        "ts-jest": "^29.2.6",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.2",
        "@ton/tolk-js": "^0.8.0",
        "@tact-lang/compiler": "^1.6.0",
        "@ton-community/func-js": "^0.9.1"
    }
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/scripts/deployCounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/scripts/deployCounterInternal.ts
================================================
import { toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const counterInternal = provider.open(
        await CounterInternal.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            Address.parse("kQDW2lkFHPO_EWAsWI90MdvqU5fr8tiELbbcfaA8FmSkMVJ8") //just a random address
        ),
    );

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counterInternal.address);

    console.log('ID', await counterInternal.getId());
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/scripts/deployHelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/scripts/deployHelloWorld.ts
================================================
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { CounterInternal } from '../wrappers/CounterInternal';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const helloWorld = provider.open(
        HelloWorld.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                ctxCounter: 0,
                ctxCounterExt: 0n,
            },
            await compile('HelloWorld')
        )
    );

    await helloWorld.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(helloWorld.address);

    const counterInternal = provider.open(
        await CounterInternal.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            helloWorld.address
        )
    );

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counterInternal.address);

    console.log('ID', await helloWorld.getID());
    console.log('ID', (await counterInternal.getId()).toString());
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/scripts/incrementCounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/scripts/incrementCounterInternal.ts
================================================
import { Address, toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('CounterInternal address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const counterInternal = provider.open(CounterInternal.fromAddress(address));

    const counterBefore = await counterInternal.getCounter();

    await counterInternal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await counterInternal.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await counterInternal.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/scripts/incrementHelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/scripts/incrementHelloWorld.ts
================================================
import { Address, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('HelloWorld address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const helloWorld = provider.open(HelloWorld.createFromAddress(address));

    const counterBefore = await helloWorld.getCounter();

    await helloWorld.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.05'),
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await helloWorld.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await helloWorld.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}



================================================
FILE: quick-start/smart-contracts/ExampleTolk/tests/CounterInternal.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/tests/CounterInternal.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { CounterInternal } from '../wrappers/CounterInternal';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('CounterInternal', () => {
    let codeHelloWorld: Cell;
    let blockchain: Blockchain;
    let counterInternal: SandboxContract<CounterInternal>;
    let deployerCounter: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        codeHelloWorld = await compile('HelloWorld');
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployerCounter = await blockchain.treasury('deployerCounter');

        // Deploy CounterInternal with HelloWorld as the owner
        counterInternal = blockchain.openContract(
            await CounterInternal.fromInit(0n, deployerCounter.address)
        );

        const deployResultCounter = await counterInternal.send(deployerCounter.getSender(), { value: toNano('1.00') }, {
            $$type: 'Deploy',
            queryId: 0n
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployerCounter.address,
            to: counterInternal.address,
            deploy: true,
            success: true
        });
    });

    it('should fail if not owner call increment', async () => {
        // Verify owner is correctly set to HelloWorld
        const ownerAddress = await counterInternal.getOwner();
        expect(ownerAddress.equals(deployerCounter.address)).toBe(true);

        // Get initial counter value
        const counterBefore = await counterInternal.getCounter();

        // Try to increase counter from a non-owner account (should fail)
        const nonOwner = await blockchain.treasury('nonOwner');
        const increaseBy = 5n;

        const nonOwnerResult = await counterInternal.send(nonOwner.getSender(), {
            value: toNano('0.05')
        }, {
            $$type: 'Add',
            amount: increaseBy,
            queryId: 0n
        });

        // This should fail since only the owner should be able to increment
        expect(nonOwnerResult.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: counterInternal.address,
            success: false,
            exitCode: 132 // The error code thrown in the contract, Access Denied
        });

        // Counter should remain unchanged
        const counterAfterNonOwner = await counterInternal.getCounter();
        expect(counterAfterNonOwner).toBe(counterBefore);
    });
});



================================================
FILE: quick-start/smart-contracts/ExampleTolk/tests/HelloWorld.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/tests/HelloWorld.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should correctly initialize and return the initial data', async () => {
        // Define the expected initial values (same as in beforeEach)
        const expectedConfig = {
            id: 0,
            counter: 0,
            counterExt: 0n
        };

        // Log the initial configuration values before verification
        console.log('Initial configuration values (before deployment):');
        console.log('- ID:', expectedConfig.id);
        console.log('- Counter:', expectedConfig.counter);
        console.log('- CounterExt:', expectedConfig.counterExt);

        console.log('Retrieved values after deployment:');
        // Verify counter value
        const counter = await helloWorld.getCounter();
        console.log('- Counter:', counter);
        expect(counter).toBe(expectedConfig.counter);

        // Verify ID value
        const id = await helloWorld.getID();
        console.log('- ID:', id);
        expect(id).toBe(expectedConfig.id);

        // Verify counterExt
        const [_, counterExt] = await helloWorld.getCounters();
        console.log('- CounterExt', counterExt);
        expect(counterExt).toBe(expectedConfig.counterExt);
    });

    it('should send an external message and update counter', async () => {
        const receiver = await blockchain.treasury('receiver');

        const receiverBalanceBefore = await receiver.getBalance();
        const [__, counterExtBefore] = await helloWorld.getCounters()
        const increase = 5;

        const result = await helloWorld.sendExternalIncrease({
            increaseBy: increase,
            value: toNano(0.05),
            addr: receiver.address,
            queryID: 0
        });

        expect(result.transactions).toHaveTransaction({
            from: undefined, // External messages have no 'from' address
            to: helloWorld.address,
            success: true,
        });

        expect(result.transactions).toHaveTransaction({
            from: helloWorld.address,
            to: receiver.address,
            success: true,
        });

        const receiverBalanceAfter = await receiver.getBalance();

        expect(receiverBalanceAfter).toBeGreaterThan(receiverBalanceBefore);
        const [_, counterExt] = await helloWorld.getCounters()
        expect(counterExtBefore + BigInt(increase)).toBe(counterExt);
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await helloWorld.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await helloWorld.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: helloWorld.address,
                success: true,
            });

            const counterAfter = await helloWorld.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});



================================================
FILE: quick-start/smart-contracts/ExampleTolk/wrappers/CounterInternal.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/wrappers/CounterInternal.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/counter_internal.tact',
    options: {
        debug: true,
    },
};



================================================
FILE: quick-start/smart-contracts/ExampleTolk/wrappers/CounterInternal.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/wrappers/CounterInternal.ts
================================================
export * from '../build/CounterInternal/tact_CounterInternal';



================================================
FILE: quick-start/smart-contracts/ExampleTolk/wrappers/HelloWorld.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/wrappers/HelloWorld.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tolk',
    entrypoint: 'contracts/hello_world.tolk',
    withStackComments: true,    // Fift output will contain comments, if you wish to debug its output
    experimentalOptions: '',    // you can pass experimental compiler options here
};



================================================
FILE: quick-start/smart-contracts/ExampleTolk/wrappers/HelloWorld.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/quick-start/smart-contracts/ExampleTolk/wrappers/HelloWorld.ts
================================================
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from '@ton/core';
import { sign } from '@ton/crypto'


export type HelloWorldConfig = {
    id: number;
    ctxCounter: number;
    ctxCounterExt: bigint;
};
export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.ctxCounter, 32)
        .storeUint(config.ctxCounterExt, 256)
    .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class HelloWorld implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    static createFromConfig(config: HelloWorldConfig, code: Cell, workchain = 0) {
        const data = helloWorldConfigToCell(config);
        const init = { code, data };
        return new HelloWorld(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async sendExternalIncrease(
        provider: ContractProvider,
        opts: {
            increaseBy: number;
            value: bigint;
            addr: Address;
            queryID?: number;
        }
    ) {
        const message = beginCell()
            .storeUint(opts.queryID ?? 0, 64)
            .storeAddress(opts.addr)
            .storeCoins(opts.value)
            .storeUint(opts.increaseBy, 32)
        .endCell()

        return await provider.external(message);
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getCounters(provider: ContractProvider) : Promise<[number, bigint]> {
        const result = await provider.get('get_counters', []);
        const ctxCounter = result.stack.readNumber();
        const ctxCounterExt = result.stack.readBigNumber();

        return [ctxCounter, ctxCounterExt]
    }
}



================================================
FILE: sandbox-examples/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/README.md
================================================
# sandbox-examples

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: sandbox-examples/contracts/distributor.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/contracts/distributor.fc
================================================
#include "imports/stdlib.fc";

int get_fwd_fee(int cells, int bits, int is_mc) impure inline asm "GETFORWARDFEE";
(slice, slice, int) dict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTMIN" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_next?(cell dict, int key_len, slice pivot) asm(pivot dict key_len -> 1 0 2) "DICTGETNEXT" "NULLSWAPIFNOT2";

;; ------- FEES ----------
const fee::distributor_storage = 50000000; ;; 0.05 TON
const fee::one_dict_iteration = 3500000; ;; 0.0035 TON
const fee::starting_computation = 4000000; ;; 0.004 TON

int fee::share_coins_computation(int dict_size) {
    return fee::one_dict_iteration * dict_size + fee::starting_computation;
}
;; ------- FEES ----------

;; ------- CONSTANTS ----------
const cnst::addr_len = 267;
const cnst::max_total_shares = 255;
;; ------- CONSTANTS ----------

int dict_get_size(cell dict) impure inline {
    int size = 0;
    var (addr, _, flag) = dict.dict_get_min?(cnst::addr_len);
    while (flag) {
        size += 1;
        (addr, _, flag) = dict.dict_get_next?(cnst::addr_len, addr);
    }

    return size;
}

;; ------- OPCODES ----------
const op::share_coins = 0x045ab564;
const op::topup = 0x76e686d3;
const op::add_user = 0x163990a0;
;; ------- OPCODES ----------

;; ------- ERRORS ----------
const err::must_be_owner = 1201;
const err::not_enough_ton_to_share = 1202;
const err::shares_size_exceeded_limit = 1203;
;; ------- ERRORS ----------

;; ------- MSG ---------
const msg::send_mode::default = 0;

const msg::bits = 6 + 267 + 132 + 1 + 4 + 4 + 64 + 32 + 1 + 1 + 32;
const msg::cells = 1;
() msg::send_text(slice to_addr, int value, slice content, int mode) impure {
    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(to_addr)
        .store_coins(value)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(0, 32)
        .store_slice(content)
        .end_cell();

    send_raw_message(msg, mode);
}
;; ------- MSG ---------

;; ----- STORAGE -------
global slice storage::owner;
global cell storage::shares;

() load_data() impure inline {
    var ds = get_data().begin_parse();

    storage::owner = ds~load_msg_addr();
    storage::shares = ds~load_dict();

    ds.end_parse();
}

() save_data() impure inline {
    set_data(
        begin_cell()
            .store_slice(storage::owner)
            .store_dict(storage::shares)
            .end_cell()
    );
}
;; ----- STORAGE -------

;; ----- LOGIC ---------
() throw_unless_owner(slice address) impure inline {
    throw_unless(err::must_be_owner, equal_slice_bits(address, storage::owner));
}

() add_user(slice sender_addr, slice in_msg_body) impure inline {
    throw_unless_owner(sender_addr);

    slice user_addr = in_msg_body~load_msg_addr();

    int total_shares = storage::shares.dict_get_size();
    throw_unless(err::shares_size_exceeded_limit, total_shares < cnst::max_total_shares);

    storage::shares~dict_set_builder(
        cnst::addr_len,
        user_addr,
        begin_cell().store_uint(1, 1)
    );

    save_data();
    return ();
}

() share_coins(slice sender_addr, int my_balance, int msg_value) impure inline {
    throw_unless_owner(sender_addr);

    int total_shares = storage::shares.dict_get_size();
    int fwd_fee = get_fwd_fee(msg::cells, msg::bits, 0);

    int ton_balance_before_msg = my_balance - msg_value;

    int storage_fee = fee::distributor_storage - min(ton_balance_before_msg, fee::distributor_storage);
    msg_value -= (storage_fee + fee::share_coins_computation(total_shares));

    throw_unless(err::not_enough_ton_to_share, total_shares * fwd_fee < msg_value);

    msg_value -= total_shares * fwd_fee;
    int distribution_portion = msg_value / total_shares;

    (slice addr, _, int flag) = storage::shares.dict_get_min?(cnst::addr_len);
    while (flag) {
        msg::send_text(addr, fwd_fee + distribution_portion, "", msg::send_mode::default);
        (addr, _, flag) = storage::shares.dict_get_next?(cnst::addr_len, addr);
    }

    save_data();
    return ();
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return (); ;; ignore all bounced messages
    }
    if (slice_bits(in_msg_body) == 0) {
        return (); ;; ignore all empty messages
    }

    slice sender_addr = cs~load_msg_addr();

    int opcode = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    load_data();

    if (opcode == op::add_user) {
        add_user(sender_addr, in_msg_body);
        return ();
    }

    if (opcode == op::share_coins) {
        share_coins(sender_addr, my_balance, msg_value);
        return ();
    }

    throw(0xffffff);
}

slice get_owner() method_id {
    load_data();
    return storage::owner;
}

cell get_shares() method_id {
    load_data();
    return storage::shares;
}



================================================
FILE: sandbox-examples/contracts/imports/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: sandbox-examples/jest.config.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: sandbox-examples/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/package.json
================================================
{
    "name": "sandbox-examples",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.19.0",
        "@ton/core": "~0",
        "@ton/crypto": "^3.2.0",
        "@ton/sandbox": "^0.17.0",
        "@ton/test-utils": "^0.4.2",
        "@ton/ton": "^13.11.1",
        "@types/jest": "^29.5.12",
        "@types/node": "^20.11.20",
        "jest": "^29.7.0",
        "prettier": "^3.2.5",
        "ts-jest": "^29.1.2",
        "ts-node": "^10.9.2",
        "typescript": "^5.4.3"
    },
    "dependencies": {
        "crc-32": "^1.2.2"
    }
}



================================================
FILE: sandbox-examples/tests/Distributor/Distributor-negative-flow.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/tests/Distributor/Distributor-negative-flow.spec.ts
================================================
import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, Dictionary, toNano } from '@ton/core';
import { Distributor, ExitCode } from '../../wrappers/Distributor';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { filterTransactions } from '@ton/test-utils/dist/test/transaction';
import { randomAddress } from '@ton/test-utils';

describe('Distributor negative', () => {
    let code: Cell;

    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let distributor: SandboxContract<Distributor>;

    beforeAll(async () => {
        code = await compile('Distributor');

        blockchain = await Blockchain.create();

        owner = await blockchain.treasury('owner');

        distributor = blockchain.openContract(
            Distributor.createFromConfig(
                {
                    owner: owner.address,
                    shares: Dictionary.empty()
                },
                code
            )
        );
    });

    it('should deploy', async () => {
        const deployResult = await distributor.sendDeploy(owner.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            deploy: true,
            success: true
        });
    });

    it('should not add user as not owner', async () => {
        const notOwner = await blockchain.treasury(`not-owner`);

        const result = await distributor.sendAddUser(notOwner.getSender(), {
            value: toNano('0.5'),
            userAddress: randomAddress()
        });

        expect(result.transactions).toHaveTransaction({
            from: notOwner.address,
            on: distributor.address,
            success: false,
            exitCode: ExitCode.MUST_BE_OWNER
        });
    });

    it('should add 255 users', async () => {
        // 255 is action list limit
        for (let i = 0; i < 255; ++i) {
            const userAddress = randomAddress();
            const result = await distributor.sendAddUser(owner.getSender(), {
                value: toNano('0.5'),
                userAddress,
            });
            expect(result.transactions).toHaveTransaction({
                from: owner.address,
                on: distributor.address,
                success: true
            });
        }
    });

    it('should not add one more user', async () => {
        const userAddress = randomAddress();

        const result = await distributor.sendAddUser(owner.getSender(), {
            value: toNano('0.5'),
            userAddress,
        });
        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            success: false,
            exitCode: ExitCode.SHARES_SIZE_EXCEEDED_LIMIT
        });
    });

    it('should share money to 255 users', async () => {
        const result = await distributor.sendShareCoins(owner.getSender(), {
            value: toNano('1000')
        });

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            success: true
        });

        printTransactionFees(result.transactions);

        const transferTransaction = filterTransactions(result.transactions, { op: 0x0 });
        expect(transferTransaction.length).toEqual(255);
    });
});



================================================
FILE: sandbox-examples/tests/Distributor/Distributor-positive-flow.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/tests/Distributor/Distributor-positive-flow.spec.ts
================================================
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, Dictionary, toNano } from '@ton/core';
import { Distributor } from '../../wrappers/Distributor';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { findTransactionRequired, flattenTransaction } from '@ton/test-utils';

describe('Distributor positive flow', () => {
    let code: Cell;

    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let firstUser: SandboxContract<TreasuryContract>;
    let secondUser: SandboxContract<TreasuryContract>;
    let distributor: SandboxContract<Distributor>;

    beforeAll(async () => {
        code = await compile('Distributor');
        blockchain = await Blockchain.create();

        owner = await blockchain.treasury('owner');
        firstUser = await blockchain.treasury('firstUser');
        secondUser = await blockchain.treasury('secondUser');

        distributor = blockchain.openContract(
            Distributor.createFromConfig(
                {
                    owner: owner.address,
                    shares: Dictionary.empty()
                },
                code
            )
        );
    });

    it('should deploy', async () => {
        const deployResult = await distributor.sendDeploy(owner.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            deploy: true,
            success: true
        });
    });

    it('should get owner', async () => {
        const ownerFromContract = await distributor.getOwner();

        expect(ownerFromContract).toEqualAddress(owner.address);
    });

    it('should get shares dict', async () => {
        const shares = await distributor.getShares();

        expect(shares.keys().length).toEqual(0);
    });

    it('should add firstUser', async () => {
        const result = await distributor.sendAddUser(owner.getSender(), {
            value: toNano('0.05'),
            userAddress: firstUser.address
        });

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            success: true
        });

        const shares = await distributor.getShares();

        expect(shares.keys()[0]).toEqualAddress(firstUser.address);
    });

    it('should share coins to one user', async () => {
        const result = await distributor.sendShareCoins(owner.getSender(), {
            value: toNano('10')
        });

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            outMessagesCount: 1,
            success: true
        });
        expect(result.transactions).toHaveTransaction({
            from: distributor.address,
            on: firstUser.address,
            op: 0x0,
            success: true
        });
    });

    it('should add secondUser', async () => {
        const result = await distributor.sendAddUser(owner.getSender(), {
            value: toNano('0.05'),
            userAddress: secondUser.address
        });

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            success: true
        });

        const shares = await distributor.getShares();

        expect(
            shares.keys().some((addr) => secondUser.address.equals(addr))
        ).toBeTruthy();
    });


    it('should share coins to 2 users', async () => {
        const result = await distributor.sendShareCoins(owner.getSender(), {
            value: toNano('10')
        });

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            on: distributor.address,
            success: true,
            outMessagesCount: 2
        });
        expect(result.transactions).toHaveTransaction({
            from: distributor.address,
            on: firstUser.address,
            op: 0x0,
            success: true
        });
        expect(result.transactions).toHaveTransaction({
            from: distributor.address,
            on: secondUser.address,
            op: 0x0,
            success: true
        });
        const firstUserTransaction = findTransactionRequired(result.transactions, { on: firstUser.address });
        const secondUserTransaction = findTransactionRequired(result.transactions, { on: secondUser.address });

        expect(flattenTransaction(firstUserTransaction).value).toEqual(flattenTransaction(secondUserTransaction).value);
    });
});



================================================
FILE: sandbox-examples/wrappers/Distributor.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/wrappers/Distributor.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/distributor.fc'],
};



================================================
FILE: sandbox-examples/wrappers/Distributor.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/sandbox-examples/wrappers/Distributor.ts
================================================
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary,
    Sender,
    SendMode
} from '@ton/core';

import crc32 from 'crc-32';

export type DistributorConfig = {
    owner: Address;
    shares: Dictionary<Address, number>;
};

export function distributorConfigToCell(config: DistributorConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeDict(config.shares)
        .endCell();
}

export const Opcode = {
    addUser: 0x163990a0,
    shareCoins: 0x045ab564
};

export const ExitCode = {
    MUST_BE_OWNER: 1201,
    SHARES_SIZE_EXCEEDED_LIMIT: 1203
};

export class Distributor implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new Distributor(address);
    }

    static createFromConfig(config: DistributorConfig, code: Cell, workchain = 0) {
        const data = distributorConfigToCell(config);
        const init = { code, data };
        return new Distributor(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }

    async sendAddUser(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
            userAddress: Address;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeInt(Opcode.addUser, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeAddress(opts.userAddress)
                .endCell()
        });
    }

    async sendShareCoins(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryId?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeInt(Opcode.shareCoins, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .endCell()
        });
    }

    async getOwner(provider: ContractProvider) {
        const result = await provider.get('get_owner', []);
        return result.stack.readAddress();
    }

    async getShares(provider: ContractProvider) {
        const result = await provider.get('get_shares', []);
        const cell = result.stack.readCellOpt();
        return Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Uint(1), cell);
    }
}



================================================
FILE: tact-exchange/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/README.md
================================================
# tact-exchange

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: tact-exchange/contracts/ft/jetton-minter.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/jetton-minter.fc
================================================
;; It is recommended to use https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc
;; instead of this contract, see https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

;; Jettons minter smart contract
#include "stdlib.fc";
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "params.fc";
;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
        ds~load_coins(), ;; total_supply
        ds~load_msg_addr(), ;; admin_address
        ds~load_ref(), ;; content
        ds~load_ref()  ;; jetton_wallet_code
    );
}

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
    set_data(begin_cell()
        .store_coins(total_supply)
        .store_slice(admin_address)
        .store_ref(content)
        .store_ref(jetton_wallet_code)
        .end_cell()
    );
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(to_wallet_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(master_msg);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

    if (op == op::mint()) {
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice to_address = in_msg_body~load_msg_addr();
        int amount = in_msg_body~load_coins();
        cell master_msg = in_msg_body~load_ref();
        slice master_msg_cs = master_msg.begin_parse();
        master_msg_cs~skip_bits(32 + 64); ;; op + query_id
        int jetton_amount = master_msg_cs~load_coins();
        mint_tokens(to_address, jetton_wallet_code, amount, master_msg);
        save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == op::burn_notification()) {
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(74,
            equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
        );
        save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
        slice response_address = in_msg_body~load_msg_addr();
        if (response_address.preload_uint(2) != 0) {
            var msg = begin_cell()
                .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
                .store_slice(response_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(op::excesses(), 32)
                .store_uint(query_id, 64);
            send_raw_message(msg.end_cell(), 2 + 64);
        }
        return ();
    }

    if (op == 3) { ;; change admin
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice new_admin_address = in_msg_body~load_msg_addr();
        save_data(total_supply, new_admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == 4) { ;; change content, delete this for immutable tokens
        throw_unless(73, equal_slices(sender_address, admin_address));
        save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
        return ();
    }

    throw(0xffff);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}



================================================
FILE: tact-exchange/contracts/ft/jetton-utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/jetton-utils.fc
================================================
#include "stdlib.fc";
#include "params.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return  begin_cell()
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address)
        .store_ref(jetton_wallet_code)
        .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(jetton_wallet_code)
        .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
        .store_uint(0, 1)
        .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    return begin_cell().store_uint(4, 3)
        .store_int(workchain(), 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}



================================================
FILE: tact-exchange/contracts/ft/jetton-wallet.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/jetton-wallet.fc
================================================
;; Jetton Wallet Smart Contract
#include "stdlib.fc";
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "params.fc";
{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption() asm "15000000 PUSHINT"; ;; 0.015 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
}

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
    set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    force_chain(to_owner_address);
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    balance -= jetton_amount;

    throw_unless(705, equal_slices(owner_address, sender_address));
    throw_unless(706, balance >= 0);

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_dict();
    int forward_ton_amount = in_msg_body~load_coins();
    throw_unless(708, slice_bits(in_msg_body) >= 1);
    slice either_forward_payload = in_msg_body;
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(to_wallet_address)
        .store_coins(0)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init);
    var msg_body = begin_cell()
        .store_uint(op::internal_transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(owner_address)
        .store_slice(response_address)
        .store_coins(forward_ton_amount)
        .store_slice(either_forward_payload)
        .end_cell();

    msg = msg.store_ref(msg_body);
    int fwd_count = forward_ton_amount ? 2 : 1;
    throw_unless(709, msg_value >
    forward_ton_amount +
    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    fwd_count * fwd_fee +
    (2 * gas_consumption() + min_tons_for_storage()));
    ;; universal message send fee calculation may be activated here
    ;; by using this instead of fwd_fee
    ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

    send_raw_message(msg.end_cell(), 64); ;; revert on errors
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(707,
        equal_slices(jetton_master_address, sender_address)
        |
        equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
    );
    int forward_ton_amount = in_msg_body~load_coins();

    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
    msg_value -= (storage_fee + gas_consumption());
    if(forward_ton_amount) {
        msg_value -= (forward_ton_amount + fwd_fee);
        slice either_forward_payload = in_msg_body;

        var msg_body = begin_cell()
            .store_uint(op::transfer_notification(), 32)
            .store_uint(query_id, 64)
            .store_coins(jetton_amount)
            .store_slice(from_address)
            .store_slice(either_forward_payload)
            .end_cell();

        var msg = begin_cell()
            .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
            .store_slice(owner_address)
            .store_coins(forward_ton_amount)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body);

        send_raw_message(msg.end_cell(), 1);
    }

    if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
        var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
            .store_slice(response_address)
            .store_coins(msg_value)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 2);
    }

    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();
    balance -= jetton_amount;
    throw_unless(705, equal_slices(owner_address, sender_address));
    throw_unless(706, balance >= 0);
    throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

    var msg_body = begin_cell()
        .store_uint(op::burn_notification(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(owner_address)
        .store_slice(response_address)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(jetton_master_address)
        .store_coins(0)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 64);

    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
    in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int op = in_msg_body~load_uint(32);
    throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);

    if (op == op::transfer()) { ;; outgoing transfer
        send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::internal_transfer()) { ;; incoming transfer
        receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
        return ();
    }

    if (op == op::burn()) { ;; burn
        burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}



================================================
FILE: tact-exchange/contracts/ft/op-codes.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/op-codes.fc
================================================
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";

;; Minter
int op::mint() asm "21 PUSHINT";



================================================
FILE: tact-exchange/contracts/ft/params.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/params.fc
================================================
#include "stdlib.fc";

int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}



================================================
FILE: tact-exchange/contracts/ft/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/ft/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";



================================================
FILE: tact-exchange/contracts/imports/constants.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/imports/constants.tact
================================================
const OrderStatusNotInited: Int = 0;
const OrderStatusInited: Int = 1;
const OrderStatusFilled: Int = 2;
const OrderStatusClosed: Int = 3;
const OrderStatusExpired: Int = 4;



================================================
FILE: tact-exchange/contracts/imports/jetton.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/imports/jetton.tact
================================================
message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    jettonAmount: Int as coins;
    fromAddress: Address;
    forwardPayload: Slice as remaining;
}

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

struct JettonWalletData {
    balance: Int as coins;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

fun calculateJettonWalletAddress(ownerAddress: Address, jettonMasterAddress: Address, jettonWalletCode: Cell): Address {
    let initData = JettonWalletData{
        balance: 0,
        ownerAddress,
        jettonMasterAddress,
        jettonWalletCode,
    };

    return contractAddress(StateInit{code: jettonWalletCode, data: initData.toCell()});
}

trait JettonValidator {
    jettonWalletCode: Cell;

    fun calculateMyJettonAddress(jettonMasterAddress: Address): Address {
        return calculateJettonWalletAddress(myAddress(), jettonMasterAddress, self.jettonWalletCode);
    }

    fun assertJettonIsValid(jettonAddress: Address, jettonMasterAddress: Address) {
        let calculatedAddress = self.calculateMyJettonAddress(jettonMasterAddress);
        nativeThrowUnless(999, jettonAddress == calculatedAddress);
    }
}


================================================
FILE: tact-exchange/contracts/imports/messages.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/imports/messages.tact
================================================
message InitOrder {
    creatorJettonAddress: Address;
    opponentJettonAddress: Address;
    opponentJettonAmount: Int as coins;
    orderCreatorAddress: Address;
}


================================================
FILE: tact-exchange/contracts/imports/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: tact-exchange/contracts/imports/types.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/imports/types.tact
================================================
struct TokenNotificationPayload {
    creatorJettonAddress: Address;
    opponentJettonAddress: Address;
    opponentJettonAmount: Int as coins;
}


================================================
FILE: tact-exchange/contracts/order.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/order.tact
================================================
import "@stdlib/ownable";

import "./imports/constants.tact";
import "./imports/jetton.tact";
import "./imports/types.tact";
import "./imports/messages.tact";


struct OrderData {
    status: Int as uint8;
    creatorJettonAddress: Address?;
    opponentJettonAddress: Address?;

    creatorJettonAmount: Int as coins = 0;
    opponentJettonAmount: Int as coins = 0;

    orderId: Int as uint32;
    owner: Address; // deployer
    orderCreatorAddress: Address?;
    jettonWalletCode: Cell;
}

contract Order with Ownable, JettonValidator {
    status: Int as uint8;
    creatorJettonAddress: Address?;
    opponentJettonAddress: Address?;

    creatorJettonAmount: Int as coins = 0;
    opponentJettonAmount: Int as coins = 0;

    orderId: Int as uint32;
    owner: Address; // deployer
    orderCreatorAddress: Address?;
    jettonWalletCode: Cell;

    init(deployerAddress: Address, orderId: Int, jettonWalletCode: Cell) {
        self.status = OrderStatusNotInited;

        self.owner = deployerAddress;
        self.orderId = orderId;
        self.jettonWalletCode = jettonWalletCode;
    }

    receive() {}

    receive(msg: InitOrder) {
        self.requireOwner();
        self.creatorJettonAddress = msg.creatorJettonAddress;
        self.opponentJettonAddress = msg.opponentJettonAddress;
        self.opponentJettonAmount = msg.opponentJettonAmount;
        self.orderCreatorAddress = msg.orderCreatorAddress;
        self.status = OrderStatusInited;
    }

    receive(msg: TokenNotification) {
        if (self.status == OrderStatusInited && msg.fromAddress == self.owner) {
            self.creatorJettonAmount = msg.jettonAmount;
            self.status = OrderStatusFilled;
            return;
        }

        if (self.status == OrderStatusFilled) {
            self.assertJettonIsValid(sender(), self.opponentJettonAddress!!);
            nativeThrowUnless(910, msg.jettonAmount == self.opponentJettonAmount);

            send(SendParameters{
                to: sender(),
                value: ton("0.2"),
                body: TokenTransfer{
                    queryId: msg.queryId,
                    amount: msg.jettonAmount,
                    destination: self.orderCreatorAddress!!,
                    responseDestination: self.orderCreatorAddress!!,
                    customPayload: null,
                    forwardTonAmount: 1,
                    forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(), // TODO: THIS IS BAD FOR GAS OMG IDK HOW TO FIX IT IN TACT
                }.toCell(),
            });

            let orderFirstJettonWalletAddress = self.calculateMyJettonAddress(self.creatorJettonAddress!!);

            send(SendParameters{
                to: orderFirstJettonWalletAddress,
                value: ton("0.2"),
                body: TokenTransfer{
                    queryId: msg.queryId,
                    amount: self.creatorJettonAmount,
                    destination: msg.fromAddress,
                    responseDestination: msg.fromAddress,
                    customPayload: null,
                    forwardTonAmount: 1,
                    forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(), // TODO: THIS IS BAD FOR GAS OMG IDK HOW TO FIX IT IN TACT
                }.toCell(),
            });

            self.status = OrderStatusClosed;
            return;
        }

        nativeThrow(911);
    }

    get fun orderData(): OrderData {
        return OrderData{
            status: self.status,
            creatorJettonAddress: self.creatorJettonAddress,
            opponentJettonAddress: self.opponentJettonAddress,
            creatorJettonAmount: self.creatorJettonAmount,
            opponentJettonAmount: self.opponentJettonAmount,
            orderId: self.orderId,
            owner: self.owner,
            orderCreatorAddress: self.orderCreatorAddress,
            jettonWalletCode: self.jettonWalletCode,
        };
    }
}



================================================
FILE: tact-exchange/contracts/order_deployer.tact
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/contracts/order_deployer.tact
================================================
import "@stdlib/ownable";
import "@stdlib/deploy";

import "./imports/constants.tact";
import "./imports/jetton.tact";
import "./imports/types.tact";
import "./imports/messages.tact";

import "./order.tact";

contract OrderDeployer with Ownable, JettonValidator, Deployable {
    owner: Address;
    nextOrderId: Int as uint32;
    jettonWalletCode: Cell;

    init(owner: Address, jettonWalletCode: Cell) {
        self.owner = owner;
        self.nextOrderId = 0;
        self.jettonWalletCode = jettonWalletCode;
    }

    receive(msg: TokenNotification) {
        let queryId = msg.queryId;
        let jettonAmount = msg.jettonAmount;
        let fromAddress = msg.fromAddress;
        let payload = TokenNotificationPayload.fromCell(msg.forwardPayload.loadRef()); // TODO: ask is load ref good or not

        self.assertJettonIsValid(sender(), payload.creatorJettonAddress);

        let orderStateInit = initOf Order(myAddress(), self.nextOrderId, self.jettonWalletCode);
        let orderAddress = contractAddress(orderStateInit);

        send(SendParameters{
            to: orderAddress,
            value: ton("0.2"),
            code: orderStateInit.code,
            data: orderStateInit.data,
            body: InitOrder{
                creatorJettonAddress: payload.creatorJettonAddress,
                opponentJettonAddress: payload.opponentJettonAddress,
                opponentJettonAmount: payload.opponentJettonAmount,
                orderCreatorAddress: fromAddress,
            }.toCell(),
        });

        self.nextOrderId += 1;

        send(SendParameters{
            to: sender(), // sender - jetton wallet address
            value: ton("0.2"),
            body: TokenTransfer{
                queryId,
                amount: jettonAmount,
                destination: orderAddress,
                responseDestination: fromAddress,
                customPayload: null,
                forwardTonAmount: ton("0.1"),
                forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse(), // TODO: THIS IS BAD FOR GAS OMG IDK HOW TO FIX IT IN TACT
            }.toCell(),
        });
    }

    get fun orderId(): Int {
        return self.nextOrderId;
    }

    get fun orderAddress(orderId: Int): Address {
        return contractAddress(initOf Order(myAddress(), orderId, self.jettonWalletCode))
    }
}



================================================
FILE: tact-exchange/jest.config.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: tact-exchange/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/package.json
================================================
{
    "name": "tact-exchange",
    "version": "0.0.1",
    "scripts": {
        "start": "blueprint run",
        "build": "blueprint build",
        "test": "jest --verbose"
    },
    "devDependencies": {
        "@ton/blueprint": "^0.21.0",
        "@ton/sandbox": "^0.19.0",
        "@ton/test-utils": "^0.4.2",
        "@types/jest": "^29.5.12",
        "@types/node": "^20.12.12",
        "jest": "^29.7.0",
        "prettier": "^3.2.5",
        "@ton/ton": "^13.11.1",
        "@ton/core": "~0",
        "@ton/crypto": "^3.2.0",
        "ts-jest": "^29.1.3",
        "ts-node": "^10.9.2",
        "typescript": "^5.4.5"
    }
}



================================================
FILE: tact-exchange/scripts/deployOrderDeployer.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/scripts/deployOrderDeployer.ts
================================================
import { toNano } from '@ton/core';
import { OrderDeployer } from '../wrappers/OrderDeployer';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const orderDeployer = provider.open(await OrderDeployer.fromInit());

    await orderDeployer.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(orderDeployer.address);

    // run methods on `orderDeployer`
}



================================================
FILE: tact-exchange/scripts/incrementOrder.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/scripts/incrementOrder.ts
================================================
import { Address, toNano } from '@ton/core';
import { Order } from '../wrappers/Order';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Order address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const order = provider.open(Order.fromAddress(address));

    const counterBefore = await order.getCounter();

    await order.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await order.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await order.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}



================================================
FILE: tact-exchange/tests/OrderDeployer.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/tests/OrderDeployer.spec.ts
================================================
import { Blockchain, prettyLogTransactions, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { JettonWallet } from '../wrappers/JettonWallet';
import { JettonMinter } from '../wrappers/JettonMinter';
import { Order } from '../wrappers/Order';
import { OrderDeployer, storeTokenNotificationPayload } from '../wrappers/OrderDeployer';

describe('OrderDeployer', () => {
    let jettonWalletCode: Cell;
    let jettonMinterCode: Cell;

    let orderAddress: Address;

    let firstJettonMinter: SandboxContract<JettonMinter>;
    let secondJettonMinter: SandboxContract<JettonMinter>;

    let blockchain: Blockchain;

    let deployer: SandboxContract<TreasuryContract>;
    let orderDeployer: SandboxContract<OrderDeployer>;
    let order: SandboxContract<Order>;

    let seller: SandboxContract<TreasuryContract>;
    let buyer: SandboxContract<TreasuryContract>;

    let orderDeployerJettonWallet: SandboxContract<JettonWallet>;
    let orderJettonWallet: SandboxContract<JettonWallet>;
    let sellerFirstJettonWallet: SandboxContract<JettonWallet>;
    let sellerSecondJettonWallet: SandboxContract<JettonWallet>;
    let buyerSecondJettonWallet: SandboxContract<JettonWallet>;
    let buyerFirstJettonWallet: SandboxContract<JettonWallet>;

    const firstAmount = 1000n;
    const secondAmount = 2000n;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        [
            jettonMinterCode,
            jettonWalletCode
        ] = await Promise.all([
            compile('JettonMinter'),
            compile('JettonWallet')
        ]);

        deployer = await blockchain.treasury('deployer');
        seller = await blockchain.treasury('seller');
        buyer = await blockchain.treasury('buyer');

        orderDeployer = blockchain.openContract(
            await OrderDeployer.fromInit(
                deployer.address, jettonWalletCode
            )
        );

        firstJettonMinter = blockchain.openContract(
            JettonMinter.createFromConfig(
                {
                    jettonWalletCode,
                    adminAddress: deployer.address,
                    content: beginCell().storeStringTail('firstminter').endCell()
                },
                jettonMinterCode
            )
        );
        await firstJettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));
        await firstJettonMinter.sendMint(deployer.getSender(), {
            jettonAmount: firstAmount,
            queryId: 9,
            toAddress: seller.address,
            amount: toNano(1),
            value: toNano(2)
        });

        secondJettonMinter = blockchain.openContract(
            JettonMinter.createFromConfig(
                {
                    jettonWalletCode,
                    adminAddress: deployer.address,
                    content: beginCell().storeStringTail('secondminter').endCell()
                },
                jettonMinterCode
            )
        );
        await secondJettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));
        await secondJettonMinter.sendMint(deployer.getSender(), {
            jettonAmount: secondAmount,
            queryId: 9,
            toAddress: buyer.address,
            amount: toNano(1),
            value: toNano(2)
        });

        sellerFirstJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(
                await firstJettonMinter.getWalletAddress(seller.address)
            )
        );
        sellerSecondJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(
                await secondJettonMinter.getWalletAddress(seller.address)
            )
        );
        buyerSecondJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(
                await secondJettonMinter.getWalletAddress(buyer.address)
            )
        );
        buyerFirstJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(
                await firstJettonMinter.getWalletAddress(buyer.address)
            )
        );
    });

    it('should deploy', async () => {
        const { transactions } = await orderDeployer.send(
            deployer.getSender(),
            {
                value: toNano(0.05)
            },
            { $$type: 'Deploy', queryId: 0n }
        );
        expect(transactions).toHaveTransaction({
            from: deployer.address,
            to: orderDeployer.address,
            deploy: true,
            success: true
        });

        const orderId = await orderDeployer.getOrderId();
        const admin = await orderDeployer.getOwner();

        expect(orderId).toEqual(0n);
        expect(admin).toEqualAddress(deployer.address);

        orderDeployerJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(
                await firstJettonMinter.getWalletAddress(orderDeployer.address)
            )
        );
    });

    it('should create order', async () => {
        const expirationTime = Math.ceil(Date.now() / 1000) + 1000;
        const price = 5;

        const result = await sellerFirstJettonWallet.sendTransfer(seller.getSender(), {
            value: toNano(2),
            fwdAmount: toNano(1),
            queryId: 9,
            jettonAmount: firstAmount,
            toAddress: orderDeployer.address,
            forwardPayload: beginCell().store(storeTokenNotificationPayload({
                $$type: 'TokenNotificationPayload',
                creatorJettonAddress: firstJettonMinter.address,
                opponentJettonAddress: secondJettonMinter.address,
                opponentJettonAmount: secondAmount,
            })).endCell()
        });

        orderAddress = await orderDeployer.getOrderAddress(0n);

        const orderJettonWalletAddress = await firstJettonMinter.getWalletAddress(orderAddress);
        orderJettonWallet = blockchain.openContract(
            JettonWallet.createFromAddress(orderJettonWalletAddress)
        );

        expect(result.transactions).toHaveTransaction({
            from: seller.address,
            to: sellerFirstJettonWallet.address,
            success: true
        });
        expect(result.transactions).toHaveTransaction({
            from: orderDeployerJettonWallet.address,
            to: orderDeployer.address,
            success: true
        });
        expect(result.transactions).toHaveTransaction({
            from: orderDeployer.address,
            to: orderAddress,
            deploy: true,
            success: true
        });
        expect(result.transactions).toHaveTransaction({
            from: orderDeployerJettonWallet.address,
            to: orderJettonWallet.address,
            success: true
        });

        const orderId = await orderDeployer.getOrderId();
        expect(orderId).toEqual(1n);

        order = blockchain.openContract(Order.fromAddress(orderAddress));
        const orderData = await order.getOrderData();

        expect(orderData.status).toEqual(2n);
        expect(orderData.opponentJettonAmount).toEqual(secondAmount);
        expect(orderData.creatorJettonAmount).toEqual(firstAmount);
        expect(orderData.creatorJettonAddress).toEqualAddress(firstJettonMinter.address);
        expect(orderData.opponentJettonAddress).toEqualAddress(secondJettonMinter.address);
        expect(orderData.orderCreatorAddress).toEqualAddress(seller.address);

        const orderJettonAmount = await orderJettonWallet.getWalletJettonAmount();
        expect(orderJettonAmount).toEqual(firstAmount);

        const sellerJettonAmount = await sellerFirstJettonWallet.getWalletJettonAmount();
        expect(sellerJettonAmount).toEqual(0n);
    });

    it('should close', async () => {
        const result = await buyerSecondJettonWallet.sendTransferSlice(buyer.getSender(), {
            value: toNano(2),
            fwdAmount: toNano(1),
            queryId: 9,
            jettonAmount: secondAmount,
            toAddress: order.address,
            forwardPayload: beginCell().storeUint(1, 1).endCell().beginParse()
        });

        expect(result.transactions).toHaveTransaction({
            from: buyer.address,
            to: buyerSecondJettonWallet.address,
            success: true
        });

        const orderData = await order.getOrderData();
        expect(orderData.status).toEqual(3n);

        const sellerSecondJettonAmount = await sellerSecondJettonWallet.getWalletJettonAmount();
        expect(sellerSecondJettonAmount).toEqual(secondAmount);

        expect(result.transactions).toHaveTransaction({
            from: buyerFirstJettonWallet.address,
            to: buyer.address,
        });

        const buyerFirstJettonAmount = await buyerFirstJettonWallet.getWalletJettonAmount();
        expect(buyerFirstJettonAmount).toEqual(firstAmount);
    });
});



================================================
FILE: tact-exchange/wrappers/JettonMinter.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/JettonMinter.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/ft/jetton-minter.fc'],
};



================================================
FILE: tact-exchange/wrappers/JettonMinter.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/JettonMinter.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleItemSlice,
} from '@ton/core';

export type JettonMinterConfig = {
  adminAddress: Address;
  content: Cell;
  jettonWalletCode: Cell;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.adminAddress)
    .storeRef(config.content)
    .storeRef(config.jettonWalletCode)
    .endCell();
}

export class JettonMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMinter(address);
  }

  static createFromConfig(
    config: JettonMinterConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonMinterConfigToCell(config);
    const init = {code, data};
    return new JettonMinter(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendMint(
    provider: ContractProvider,
    via: Sender,
    opts: {
      toAddress: Address;
      jettonAmount: bigint;
      amount: bigint;
      queryId: number;
      value: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(21, 32)
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.toAddress)
        .storeCoins(opts.amount)
        .storeRef(
          beginCell()
            .storeUint(0x178d4519, 32)
            .storeUint(opts.queryId, 64)
            .storeCoins(opts.jettonAmount)
            .storeAddress(this.address)
            .storeAddress(this.address)
            .storeCoins(0)
            .storeUint(0, 1)
            .endCell()
        )
        .endCell(),
    });
  }

  async getWalletAddress(
    provider: ContractProvider,
    address: Address
  ): Promise<Address> {
    const result = await provider.get('get_wallet_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(address).endCell(),
      } as TupleItemSlice,
    ]);

    return result.stack.readAddress();
  }

  async getTotalSupply(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('get_jetton_data', []);
    return result.stack.readBigNumber();
  }
}



================================================
FILE: tact-exchange/wrappers/JettonWallet.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/JettonWallet.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/ft/jetton-wallet.fc'],
};



================================================
FILE: tact-exchange/wrappers/JettonWallet.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/JettonWallet.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Slice,
} from '@ton/core';
import {Maybe} from '@ton/ton/dist/utils/maybe';

export type JettonWalletConfig = {
  ownerAddress: Address;
  minterAddress: Address;
  walletCode: Cell;
};

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.ownerAddress)
    .storeAddress(config.minterAddress)
    .storeRef(config.walletCode)
    .endCell();
}

export class JettonWallet implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new JettonWallet(address);
  }

  static createFromConfig(
    config: JettonWalletConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonWalletConfigToCell(config);
    const init = {code, data};
    return new JettonWallet(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
      forwardPayload?: Maybe<Cell>;
    }
  ) {
    const builder = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(opts.queryId, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount);

    builder.storeMaybeRef(opts.forwardPayload);
    // console.log(builder.endCell().toString());
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async sendTransferSlice(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
      forwardPayload: Slice;
    }
  ) {
    const builder = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(opts.queryId, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount)
      .storeUint(0, 1)
      .storeSlice(opts.forwardPayload);

    // console.log(builder.endCell().toString());
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async sendBurn(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: number;
      jettonAmount: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x595f07bc, 32)
        .storeUint(opts.queryId, 64)
        .storeCoins(opts.jettonAmount)
        .storeAddress(via.address)
        .storeUint(0, 1)
        .endCell(),
    });
  }

  async getWalletJettonAmount(provider: ContractProvider): Promise<bigint> {
    const {stack} = await provider.get('get_wallet_data', []);
    return stack.readBigNumber();
  }
}



================================================
FILE: tact-exchange/wrappers/Order.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/Order.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/order.tact',
    options: {
        debug: true,
    },
};



================================================
FILE: tact-exchange/wrappers/Order.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/Order.ts
================================================
export * from '../build/Order/tact_Order';



================================================
FILE: tact-exchange/wrappers/OrderDeployer.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/OrderDeployer.compile.ts
================================================
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/order_deployer.tact',
    options: {
        debug: true,
    },
};



================================================
FILE: tact-exchange/wrappers/OrderDeployer.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/tact-exchange/wrappers/OrderDeployer.ts
================================================
export * from '../build/OrderDeployer/tact_OrderDeployer';



================================================
FILE: test-utils/common-wrappers/JettonMinter.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/test-utils/common-wrappers/JettonMinter.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  StateInit,
  TupleBuilder,
} from '@ton/core';
import { Maybe } from '@ton/core/dist/utils/maybe';
import { JettonMaster } from '@ton/ton';

export type JettonMinterConfig = {
  adminAddress: Address;
  content: Cell;
  jettonWalletCode: Cell;
};

export class JettonMinter implements Contract {
  static readonly code = Cell.fromBase64(
    'te6ccgECDQEAApwAART/APSkE/S88sgLAQIBYgIDAgLMBAUCA3pgCwwC8dkGOASS+B8ADoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABgBaY/pn/aiaH0AfSBqahhACqk4XUcZmpqbGyiaY4L5cCSBfSB9AGoYEGhAMGuQ/QAYEogaKCF4BQpQKBnkKAJ9ASxni2ZmZPaqcEEIPe7L7yk4XXGBQGBwCTtfBQiAbgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA+X/5Og7wAxkZYKsZ4soAn0BCeW1iWZmZLj9gEBwDY3NwH6APpA+ChUEgZwVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQBscF8uBKoQNFRchQBPoCWM8WzMzJ7VQB+kAwINcLAcMAkVvjDQgBpoIQLHa5c1JwuuMCNTc3I8ADjhozUDXHBfLgSQP6QDBZyFAE+gJYzxbMzMntVOA1AsAEjhhRJMcF8uBJ1DBDAMhQBPoCWM8WzMzJ7VTgXwWED/LwCQA+ghDVMnbbcIAQyMsFUAPPFiL6AhLLassfyz/JgEL7AAH+Nl8DggiYloAVoBW88uBLAvpA0wAwlcghzxbJkW3ighDRc1QAcIAYyMsFUAXPFiT6AhTLahPLHxTLPyP6RDBwuo4z+ChEA3BUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJ+QBwdMjLAsoHy//J0M8WlmwicAHLAeL0AAoACsmAQPsAAH2tvPaiaH0AfSBqahg2GPwUALgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBk/IA4OmRlgWUD5f/k6EAAH68W9qJofQB9IGpqGD+qkEA=',
  );

  static OPCODES = {
    MINT: 21,
    CHANGE_ADMIN: 3,
    CHANGE_CONTENT: 4,
    INTERNAL_TRANSFER: 0x178d4519,
  };

  static configToCell(config: JettonMinterConfig): Cell {
    return beginCell()
      .storeCoins(0)
      .storeAddress(config.adminAddress)
      .storeRef(config.content)
      .storeRef(config.jettonWalletCode)
      .endCell();
  }

  static createFromAddress(address: Address): JettonMinter {
    return new JettonMinter(address);
  }

  static createFromConfig(
    config: JettonMinterConfig,
    code: Cell = JettonMinter.code,
    workchain = 0,
  ) {
    const data = JettonMinter.configToCell(config);
    const init = { code, data };
    return new JettonMinter(contractAddress(workchain, init), init);
  }

  constructor(
    readonly address: Address,
    readonly init?: Maybe<StateInit>,
  ) {
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendMint(
    provider: ContractProvider,
    via: Sender,
    opts: {
      toAddress: Address;
      excessesAddress: Address;
      jettonAmount: bigint;
      amount: bigint;
      queryId: number;
      value: bigint;
      fwdTonAmount?: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(JettonMinter.OPCODES.MINT, 32)
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.toAddress)
        .storeCoins(opts.amount)
        .storeRef(
          beginCell()
            .storeUint(JettonMinter.OPCODES.INTERNAL_TRANSFER, 32)
            .storeUint(opts.queryId, 64)
            .storeCoins(opts.jettonAmount)
            .storeAddress(null)
            .storeAddress(opts.excessesAddress)
            .storeCoins(opts.fwdTonAmount ?? 0)
            .storeMaybeRef(null)
            .endCell(),
        )
        .endCell(),
    });
  }

  async sendChangeAdmin(
    provider: ContractProvider,
    via: Sender,
    opts: {
      newAdminAddress: Maybe<Address>;
      queryId: number;
      value: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(JettonMinter.OPCODES.CHANGE_ADMIN, 32)
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.newAdminAddress)
        .endCell(),
    });
  }

  async sendChangeContent(
    provider: ContractProvider,
    via: Sender,
    opts: {
      newContent: Cell;
      queryId: number;
      value: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(JettonMinter.OPCODES.CHANGE_CONTENT, 32)
        .storeUint(opts.queryId, 64)
        .storeRef(opts.newContent)
        .endCell(),
    });
  }

  async getWalletAddress(
    provider: ContractProvider,
    ownerAddress: Address,
  ): Promise<Address> {
    const builder = new TupleBuilder();
    builder.writeAddress(ownerAddress);

    const { stack } = await provider.get('get_wallet_address', builder.build());

    return stack.readAddress();
  }

  async getWalletData(provider: ContractProvider): Promise<{
    totalSupply: bigint;
    mintable: boolean;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
  }> {
    const { stack } = await provider.get('get_jetton_data', []);

    return {
      totalSupply: stack.readBigNumber(),
      mintable: stack.readBoolean(),
      adminAddress: stack.readAddress(),
      jettonContent: stack.readCell(),
      jettonWalletCode: stack.readCell(),
    };
  }
}



================================================
FILE: test-utils/common-wrappers/JettonWallet.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/test-utils/common-wrappers/JettonWallet.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Slice,
  StateInit,
} from '@ton/core';
import { Maybe } from '@ton/core/dist/utils/maybe';

export type JettonWalletConfig = {
  ownerAddress: Address;
  minterAddress: Address;
  walletCode: Cell;
};

export class JettonWallet implements Contract {
  static readonly code = Cell.fromBase64(
    'te6ccgECIQEABIQAAlOEVJLUBMyoEngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAgEDAMADART/APSkE/S88sgLEQIBIAQFAUO/8ILrZjtXoAGS9KasRnKI3y3+3bnaG+4o9lIci+vSHx7ABgIBIAcIAEQAaHR0cHM6Ly9ncmFtY29pbi5vcmcvaW1nL2ljb24ucG5nAgEgCQoCASANDgFBv0VGpv/ht5z92GutPbh0MT3N4vsF5qdKp/NVLZYXx50TCwFBv27U+UKnhIziywZrd6ESjGof+MQ/Q4otziRhK6n/q4sDDAAKAEdyYW0ACgBHUkFNAUG/Ugje9G9aHU+dzmarMJ9KhRMF8Wb5Hvedkj71jjT5ogkPAUG/XQH6XjwGkBxFBGxrLdzqWvdk/qDu1yoQ1ATyMSzrJH0QAFoAVGhlIGZpcnN0LWV2ZXIgUG9XIGpldHRvbiBvbiBUT04gQmxvY2tjaGFpbi4ABAA5AgFiEhMCAswUFQAboPYF2omh9AH0gfSBqGECAdQWFwIBIBgZAMMIMcAkl8E4AHQ0wMBcbCVE18D8Azg+kD6QDH6ADFx1yH6ADH6ADBzqbQAAtMfghAPin6lUiC6lTE0WfAJ4IIQF41FGVIgupYxREQD8ArgNYIQWV8HvLqTWfAL4F8EhA/y8IAARPpEMHC68uFNgAgEgGhsAg9QBBrkPaiaH0AfSB9IGoYAmmPwQgLxqKMqRBdQQg97svvCd0JWPlxYumfmP0AGAnQKBHkKAJ9ASxniwDni2Zk9qpAHxUD0z/6APpAIfAB7UTQ+gD6QPpA1DBRNqFSKscF8uLBKML/8uLCVDRCcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMkg+QBwdMjLAsoHy//J0AT6QPQEMfoAINdJwgDy4sR3gBjIywVQCM8WcPoCF8trE8yBwCASAdHgCeghAXjUUZyMsfGcs/UAf6AiLPFlAGzxYl+gJQA88WyVAFzCORcpFx4lAIqBOgggnJw4CgFLzy4sUEyYBA+wAQI8hQBPoCWM8WAc8WzMntVAL3O1E0PoA+kD6QNQwCNM/+gBRUaAF+kD6QFNbxwVUc21wVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQDccFHLHy4sMK+gBRqKGCCJiWgGa2CKGCCJiWgKAYoSeXEEkQODdfBOMNJdcLAYB8gANc7UTQ+gD6QPpA1DAH0z/6APpAMFFRoVJJxwXy4sEnwv/y4sIFggkxLQCgFrzy4sOCEHvdl97Iyx8Vyz9QA/oCIs8WAc8WyXGAGMjLBSTPFnD6AstqzMmAQPsAQBPIUAT6AljPFgHPFszJ7VSAAcFJ5oBihghBzYtCcyMsfUjDLP1j6AlAHzxZQB88WyXGAEMjLBSTPFlAG+gIVy2oUzMlx+wAQJBAjAHzDACPCALCOIYIQ1TJ223CAEMjLBVAIzxZQBPoCFstqEssfEss/yXL7AJM1bCHiA8hQBPoCWM8WAc8WzMntVA==',
  );

  static readonly OPCODES = {
    TRANSFER: 0xf8a7ea5,
    BURN: 0x595f07bc,
  };

  static configToCell(config: JettonWalletConfig): Cell {
    return beginCell()
      .storeCoins(0)
      .storeAddress(config.ownerAddress)
      .storeAddress(config.minterAddress)
      .storeRef(config.walletCode)
      .endCell();
  }

  constructor(
    readonly address: Address,
    readonly init?: Maybe<StateInit>,
  ) {
  }

  static createFromAddress(address: Address) {
    return new JettonWallet(address);
  }

  static createFromConfig(
    config: JettonWalletConfig,
    code: Cell = JettonWallet.code,
    workchain = 0,
  ) {
    const data = JettonWallet.configToCell(config);
    const init = { code, data };
    return new JettonWallet(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
      forwardPayload?: Maybe<Cell | Slice>;
    },
  ) {
    const builder = beginCell()
      .storeUint(JettonWallet.OPCODES.TRANSFER, 32)
      .storeUint(opts.queryId, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount);

    if (opts.forwardPayload instanceof Slice) {
      builder.storeSlice(opts.forwardPayload);
    } else {
      builder.storeMaybeRef(opts.forwardPayload);
    }

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async sendBurn(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: number;
      jettonAmount: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(JettonWallet.OPCODES.BURN, 32)
        .storeUint(opts.queryId, 64)
        .storeCoins(opts.jettonAmount)
        .storeAddress(via.address)
        .storeUint(0, 1)
        .endCell(),
    });
  }

  async getWalletData(provider: ContractProvider): Promise<{
    balance: bigint;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
  }> {
    const { stack } = await provider.get('get_wallet_data', []);

    return {
      balance: stack.readBigNumber(),
      ownerAddress: stack.readAddress(),
      jettonMasterAddress: stack.readAddress(),
      jettonWalletCode: stack.readCell(),
    };
  }
}



================================================
FILE: test-utils/common-wrappers/NftCollection.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/test-utils/common-wrappers/NftCollection.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  StateInit,
  toNano,
  TupleBuilder,
} from '@ton/core';
import { NftItem } from './NftItem';

export type NftCollectionConfig = {
  ownerAddress: Address;
  nextItemIndex?: number;
  content?: Cell;
  nftItemCode?: Cell;
  royaltyParams?: Cell;
};

export class NftCollection implements Contract {
  static readonly code = Cell.fromBase64(
    'te6ccgECEwEAAf4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgPr0QY4BIrfAA6GmBgLjYSK3wfSAYAOmP6Z/2omh9IGmf6mpqGEEINJ6cqClAXUcUG6+CgOhBCFRlgFa4QAhkZYKoAueLEn0BCmW1CeWP5Z+A54tkwCB9gHAbKLnjgvlwyJLgAPGBEuABcYEZAmAB8YEvgsIH+XhAYHCAIBIAkKAGA1AtM/UxO78uGSUxO6AfoA1DAoEDRZ8AaOEgGkQ0PIUAXPFhPLP8zMzMntVJJfBeIApjVwA9QwjjeAQPSWb6UgjikGpCCBAPq+k/LBj96BAZMhoFMlu/L0AvoA1DAiVEsw8AYjupMCpALeBJJsIeKz5jAyUERDE8hQBc8WE8s/zMzMye1UACgB+kAwQUTIUAXPFhPLP8zMzMntVAIBIAsMAD1FrwBHAh8AV3gBjIywVYzxZQBPoCE8trEszMyXH7AIAC0AcjLP/gozxbJcCDIywET9AD0AMsAyYAAbPkAdMjLAhLKB8v/ydCACASAPEAAlvILfaiaH0gaZ/qamoYLehqGCxABDuLXTHtRND6QNM/1NTUMBAkXwTQ1DHUMNBxyMsHAc8WzMmAIBIBESAC+12v2omh9IGmf6mpqGDYg6GmH6Yf9IBhAALbT0faiaH0gaZ/qamoYCi+CeAI4APgCw',
  );

  static readonly OPCODES = {
    DEPLOY_NFT: 1,
    BATCH_DEPLOY_NFT: 2,
  };

  static configToCell(config: NftCollectionConfig): Cell {
    return beginCell()
      .storeAddress(config.ownerAddress)
      .storeUint(config.nextItemIndex ?? 0, 64)
      .storeRef(config.content ?? beginCell().storeRef(new Cell()))
      .storeRef(config.nftItemCode ?? NftItem.code)
      .storeRef(config.royaltyParams ?? Cell.EMPTY)
      .endCell();
  }

  static createFromAddress(address: Address) {
    return new NftCollection(address);
  }

  static createFromConfig(
    config: NftCollectionConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = NftCollection.configToCell(config);
    const init = { code, data };
    return new NftCollection(contractAddress(workchain, init), init);
  }

  constructor(
    readonly address: Address,
    readonly init?: StateInit,
  ) {
  }

  async sendDeployNft(
    provider: ContractProvider,
    via: Sender,
    opts: {
      to: Address;
      queryId: number;
      index: number;
      value: bigint;
      itemValue?: bigint;
      content?: Cell;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      body: beginCell()
        .storeUint(NftCollection.OPCODES.DEPLOY_NFT, 32)
        .storeUint(opts.queryId, 64)
        .storeUint(opts.index, 64)
        .storeCoins(opts.itemValue ?? toNano('0.02'))
        .storeRef(
          beginCell()
            .storeAddress(opts.to)
            .storeRef(opts.content ?? Cell.EMPTY),
        )
        .endCell(),
    });
  }

  async getRoyaltyParams(provider: ContractProvider): Promise<{
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
  }> {
    const { stack } = await provider.get('royalty_params', []);

    return {
      royaltyFactor: stack.readNumber(),
      royaltyBase: stack.readNumber(),
      royaltyAddress: stack.readAddress(),
    };
  }

  async getNftAddressByIndex(
    provider: ContractProvider,
    index: number,
  ): Promise<Address> {
    const builder = new TupleBuilder();
    builder.writeNumber(index);

    const { stack } = await provider.get(
      'get_nft_address_by_index',
      builder.build(),
    );

    return stack.readAddress();
  }

  async getCollectionData(provider: ContractProvider): Promise<{
    nextItemIndex: number;
    collectionContent: Cell;
    ownerAddress: Address;
  }> {
    const { stack } = await provider.get('get_collection_data', []);
    return {
      nextItemIndex: stack.readNumber(),
      collectionContent: stack.readCell(),
      ownerAddress: stack.readAddress(),
    };
  }
}



================================================
FILE: test-utils/common-wrappers/NftItem.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/test-utils/common-wrappers/NftItem.ts
================================================
import {
  Address,
  beginCell,
  Builder,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  StateInit,
} from '@ton/core';

export type NftItemConfig = {
  itemIndex: number;
  collectionAddress: Address;
  ownerAddress?: Address;
  content?: Cell;
};

export class NftItem implements Contract {
  static readonly code = Cell.fromBase64(
    'te6ccgECDQEAAdAAART/APSkE/S88sgLAQIBYgIDAgLOBAUACaEfn+AFAgEgBgcCASALDALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCAkAET6RDBwuvLhTYAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viCgBycIIQi3cXNQXIy/9QBM8WECSAQHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAAIICjjUm8AGCENUydtsQN0QAbXFwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AJMwMjTiVQLwAwA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAB0A8jLP1jPFgHPFszJ7VSA=',
  );

  static readonly OPCODES = {
    TRANSFER: 0x5fcc3d14,
  };

  constructor(
    readonly address: Address,
    readonly init?: StateInit,
  ) {
  }

  static createFromAddress(address: Address) {
    return new NftItem(address);
  }

  static createFromConfig(
    config: NftItemConfig,
    code: Cell = NftItem.code,
    workchain = 0,
  ) {
    const data = NftItem.configToCell(config);
    const init = { code, data };
    return new NftItem(contractAddress(workchain, init), init);
  }

  static configToCell(config: NftItemConfig): Cell {
    const builder = beginCell()
      .storeUint(config.itemIndex, 64)
      .storeAddress(config.collectionAddress);

    if (config.ownerAddress) {
      builder.storeAddress(config.ownerAddress);
    }
    if (config.content) {
      builder.storeRef(config.content);
    }

    return builder.endCell();
  }

  async sendDeploy(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      ownerAddress: Address;
      content: Cell;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeAddress(opts.ownerAddress)
        .storeRef(opts.content)
        .endCell(),
    });
  }

  async sendTransferOwnership(
    provider: ContractProvider,
    via: Sender,
    opts: {
      queryId: number;
      value: bigint;
      to: Address;
      responseTo?: Address;
      forwardAmount?: bigint;
      forwardBody?: Cell | Builder;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      body: beginCell()
        .storeUint(NftItem.OPCODES.TRANSFER, 32)
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.to)
        .storeAddress(opts.responseTo)
        .storeMaybeRef(null)
        .storeCoins(opts.forwardAmount ?? 0)
        .storeMaybeRef(opts.forwardBody)
        .endCell(),
    });
  }

  async getNftData(provider: ContractProvider): Promise<{
    init: boolean;
    index: number;
    collectionAddress: Address | null;
    ownerAddress: Address | null;
    individualContent: Cell | null;
  }> {
    const { stack } = await provider.get('get_nft_data', []);

    return {
      init: stack.readBoolean(),
      index: stack.readNumber(),
      collectionAddress: stack.readAddressOpt(),
      ownerAddress: stack.readAddressOpt(),
      individualContent: stack.readCellOpt(),
    };
  }
}



================================================
FILE: test-utils/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/test-utils/package.json
================================================
{
  "name": "test-utils",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "@ton/core": "^0.56.3",
    "@ton/ton": "^13.11.1"
  }
}



================================================
FILE: ton-exchange/.editorconfig
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/.editorconfig
================================================
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
insert_final_newline = true



================================================
FILE: ton-exchange/.eslintignore
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/.eslintignore
================================================
build/
temp/
contracts/**



================================================
FILE: ton-exchange/.eslintrc.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/.eslintrc.json
================================================
{
  "extends": "./node_modules/gts/",
  "rules": {
    "node/no-unpublished-import": 0
  }
}



================================================
FILE: ton-exchange/README.md
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/README.md
================================================
# OrderDeployer

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`



================================================
FILE: ton-exchange/contracts/ft/jetton-minter.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/jetton-minter.fc
================================================
;; It is recommended to use https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-discoverable.fc
;; instead of this contract, see https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

;; Jettons minter smart contract
#include "stdlib.fc";
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "params.fc";
;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
        ds~load_coins(), ;; total_supply
        ds~load_msg_addr(), ;; admin_address
        ds~load_ref(), ;; content
        ds~load_ref()  ;; jetton_wallet_code
    );
}

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
    set_data(begin_cell()
        .store_coins(total_supply)
        .store_slice(admin_address)
        .store_ref(content)
        .store_ref(jetton_wallet_code)
        .end_cell()
    );
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(to_wallet_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(master_msg);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

    if (op == op::mint()) {
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice to_address = in_msg_body~load_msg_addr();
        int amount = in_msg_body~load_coins();
        cell master_msg = in_msg_body~load_ref();
        slice master_msg_cs = master_msg.begin_parse();
        master_msg_cs~skip_bits(32 + 64); ;; op + query_id
        int jetton_amount = master_msg_cs~load_coins();
        mint_tokens(to_address, jetton_wallet_code, amount, master_msg);
        save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == op::burn_notification()) {
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(74,
            equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
        );
        save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
        slice response_address = in_msg_body~load_msg_addr();
        if (response_address.preload_uint(2) != 0) {
            var msg = begin_cell()
                .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
                .store_slice(response_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(op::excesses(), 32)
                .store_uint(query_id, 64);
            send_raw_message(msg.end_cell(), 2 + 64);
        }
        return ();
    }

    if (op == 3) { ;; change admin
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice new_admin_address = in_msg_body~load_msg_addr();
        save_data(total_supply, new_admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == 4) { ;; change content, delete this for immutable tokens
        throw_unless(73, equal_slices(sender_address, admin_address));
        save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
        return ();
    }

    throw(0xffff);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}



================================================
FILE: ton-exchange/contracts/ft/jetton-utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/jetton-utils.fc
================================================
#include "stdlib.fc";
#include "params.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return  begin_cell()
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address)
        .store_ref(jetton_wallet_code)
        .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(jetton_wallet_code)
        .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
        .store_uint(0, 1)
        .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    return begin_cell().store_uint(4, 3)
        .store_int(workchain(), 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}



================================================
FILE: ton-exchange/contracts/ft/jetton-wallet.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/jetton-wallet.fc
================================================
;; Jetton Wallet Smart Contract
#include "stdlib.fc";
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "params.fc";
{-

NOTE that this tokens can be transferred within the same workchain.

This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

1) use more expensive but universal function to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption() asm "15000000 PUSHINT"; ;; 0.015 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
}

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
    set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code));
}

{-
  transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
           response_destination:MsgAddress custom_payload:(Maybe ^Cell)
           forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
           = InternalMsgBody;
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    force_chain(to_owner_address);
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    balance -= jetton_amount;

    throw_unless(705, equal_slices(owner_address, sender_address));
    throw_unless(706, balance >= 0);

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_dict();
    int forward_ton_amount = in_msg_body~load_coins();
    throw_unless(708, slice_bits(in_msg_body) >= 1);
    slice either_forward_payload = in_msg_body;
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(to_wallet_address)
        .store_coins(0)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init);
    var msg_body = begin_cell()
        .store_uint(op::internal_transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(owner_address)
        .store_slice(response_address)
        .store_coins(forward_ton_amount)
        .store_slice(either_forward_payload)
        .end_cell();

    msg = msg.store_ref(msg_body);
    int fwd_count = forward_ton_amount ? 2 : 1;
    throw_unless(709, msg_value >
    forward_ton_amount +
    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    fwd_count * fwd_fee +
    (2 * gas_consumption() + min_tons_for_storage()));
    ;; universal message send fee calculation may be activated here
    ;; by using this instead of fwd_fee
    ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

    send_raw_message(msg.end_cell(), 64); ;; revert on errors
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(707,
        equal_slices(jetton_master_address, sender_address)
        |
        equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
    );
    int forward_ton_amount = in_msg_body~load_coins();

    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());
    msg_value -= (storage_fee + gas_consumption());
    if(forward_ton_amount) {
        msg_value -= (forward_ton_amount + fwd_fee);
        slice either_forward_payload = in_msg_body;

        var msg_body = begin_cell()
            .store_uint(op::transfer_notification(), 32)
            .store_uint(query_id, 64)
            .store_coins(jetton_amount)
            .store_slice(from_address)
            .store_slice(either_forward_payload)
            .end_cell();

        var msg = begin_cell()
            .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
            .store_slice(owner_address)
            .store_coins(forward_ton_amount)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body);

        send_raw_message(msg.end_cell(), 1);
    }

    if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
        var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
            .store_slice(response_address)
            .store_coins(msg_value)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 2);
    }

    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();
    balance -= jetton_amount;
    throw_unless(705, equal_slices(owner_address, sender_address));
    throw_unless(706, balance >= 0);
    throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

    var msg_body = begin_cell()
        .store_uint(op::burn_notification(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(owner_address)
        .store_slice(response_address)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(jetton_master_address)
        .store_coins(0)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 64);

    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
    in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    int op = in_msg_body~load_uint(32);
    throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);

    if (op == op::transfer()) { ;; outgoing transfer
        send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::internal_transfer()) { ;; incoming transfer
        receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
        return ();
    }

    if (op == op::burn()) { ;; burn
        burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}



================================================
FILE: ton-exchange/contracts/ft/op-codes.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/op-codes.fc
================================================
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";

;; Minter
int op::mint() asm "21 PUSHINT";



================================================
FILE: ton-exchange/contracts/ft/params.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/params.fc
================================================
#include "stdlib.fc";

int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}



================================================
FILE: ton-exchange/contracts/ft/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ft/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";



================================================
FILE: ton-exchange/contracts/imports/constants.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/constants.fc
================================================
;; commision is taken from deploy and messages fees
const create_order_comission_percent = 15;

const order_type::JETTON = 0;
const order_type::TON = 1;

const swap::TON_JETTON = 0;
const swap::JETTON_TON = 1;

const side::SELLER = 0;
const side::BUYER = 1;

const status::NOT_INITIALIZED = 0;
const status::INITIALIZED = 1;
const status::FILLED = 2;
const status::CLOSED = 3;
const status::EXPIRED = 4;
const status::RECALLED = 5;

const NORM_FACTOR = 1000000000; ;; 10^9



================================================
FILE: ton-exchange/contracts/imports/jetton-utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/jetton-utils.fc
================================================
#include "stdlib.fc";
#include "params.fc";

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return  begin_cell()
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address)
        .store_ref(jetton_wallet_code)
        .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(jetton_wallet_code)
        .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))
        .store_uint(0, 1)
        .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    return begin_cell().store_uint(4, 3)
        .store_int(workchain(), 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}



================================================
FILE: ton-exchange/contracts/imports/opcodes.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/opcodes.fc
================================================
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::init_order() asm "0x25DE17E2 PUSHINT";
int op::recall_order() asm "0x84302c25 PUSHINT";




================================================
FILE: ton-exchange/contracts/imports/order-asserts.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/order-asserts.fc
================================================
#include "stdlib.fc";
#include "jetton-utils.fc";
#include "out-log.fc";

(int) check_if_fill_order_payload_invalid(slice either_forward_payload) impure inline {
    return slice_bits(either_forward_payload) != 267 + 267 + 1 + 64 + 64; ;; base addr, quote addr, side, price, expiration_time_t
}


() throw_if_jetton_wallet_fraud_detected(slice provided_address, slice jetton_wallet_master_address, cell jetton_wallet_code) impure inline {
    cell jetton_wallet_state_init = calculate_jetton_wallet_state_init(my_address(), jetton_wallet_master_address, jetton_wallet_code);
    slice calculated_jetton_wallet_address = calculate_jetton_wallet_address(jetton_wallet_state_init);
    throw_unless(899, equal_slices(provided_address, calculated_jetton_wallet_address));
}

(int) check_if_jetton_wallet_fraud_detected(slice provided_address, slice jetton_wallet_master_address, cell jetton_wallet_code) impure inline {
    cell jetton_wallet_state_init = calculate_jetton_wallet_state_init(my_address(), jetton_wallet_master_address, jetton_wallet_code);
    slice calculated_jetton_wallet_address = calculate_jetton_wallet_address(jetton_wallet_state_init);
    return equal_slices(provided_address, calculated_jetton_wallet_address) == 0; ;; false
}



================================================
FILE: ton-exchange/contracts/imports/order-utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/order-utils.fc
================================================
#include "constants.fc";
#include "stdlib.fc";
#include "jetton-utils.fc";

cell pack_order_data(int status, slice base_jetton_address, slice quote_jetton_address, int side, int total_amount, int price, int order_id, slice deployer_address, slice creator_address, slice wallet_address, cell order_code, cell jetton_wallet_code, int expiration_time_t) inline {
    cell total_base_quote_cell = begin_cell()
        .store_coins(total_amount)
        .store_slice(base_jetton_address)
        .store_slice(quote_jetton_address)
        .end_cell();

    return begin_cell()
        .store_uint(status, 3)
        .store_ref(total_base_quote_cell)
        .store_uint(side, 1)
        .store_uint(price, 64)
        .store_uint(order_id, 32)
        .store_slice(deployer_address)
        .store_slice(creator_address)
        .store_slice(wallet_address)
        .store_ref(order_code)
        .store_ref(jetton_wallet_code)
        .store_uint(expiration_time_t, 64)
        .end_cell();
}

cell calculate_order_state_init(slice deployer_address, int order_id, cell order_code, cell jetton_wallet_code) impure inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(order_code)
        .store_dict(pack_order_data(0, "", "", 0, 0, 0, order_id, deployer_address, "", "", order_code, jetton_wallet_code, 0))
        .store_uint(0, 1)
        .end_cell();
}

slice calculate_order_address(cell state_init) impure inline {
    return begin_cell().store_uint(4, 3)
        .store_int(workchain(), 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

int calculate_quantity(int side, int jetton_amount, int price) impure inline {
    return side == side::SELLER ? jetton_amount : jetton_amount * NORM_FACTOR / price;
}





================================================
FILE: ton-exchange/contracts/imports/out-log.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/out-log.fc
================================================
#include "utils.fc";

builder store::ext_out_msg_info::ref(builder b)
asm "b{11} x{0000000000000000000000000} |+ b{01} |+ STSLICECONST";

() send_log(builder log) impure inline {
  var ext_msg = begin_cell()
  .store::ext_out_msg_info::ref()
  .store_ref(begin_cell()
  .store_builder(log)
  .end_cell());
  send_raw_message(ext_msg.end_cell(), 3); ;; pay transfer fee, ignore errors
}



================================================
FILE: ton-exchange/contracts/imports/params.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/params.fc
================================================
#include "stdlib.fc";

int workchain() asm "0 PUSHINT";



================================================
FILE: ton-exchange/contracts/imports/stdlib.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";



================================================
FILE: ton-exchange/contracts/imports/ton-order/fees.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/ton-order/fees.fc
================================================
int fee::ton_order::create_consumption() asm "20000000 PUSHINT"; ;; 0.02 TON
int fee::ton_order::fill_consumption() asm "10000000 PUSHINT"; ;; 0.010 TON
int fee::ton_order::close_consumption() asm "15000000 PUSHINT"; ;; 0.015 TON



================================================
FILE: ton-exchange/contracts/imports/ton-order/opcodes.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/ton-order/opcodes.fc
================================================
int op::notification::create_order() asm "0x26DE15E1 PUSHINT";
int op::notification::create_ton_order() asm "0x26DE15E2 PUSHINT";

int op::create_ton_order() asm "0x26DE17E2 PUSHINT";
int op::init_ton_order() asm "0x26DE17E3 PUSHINT";
int op::close_ton_order() asm "0x26DE17E4 PUSHINT";
int op::recall_ton_order() asm "0x26DE17E5 PUSHINT";



================================================
FILE: ton-exchange/contracts/imports/ton-order/utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/ton-order/utils.fc
================================================
#include "../stdlib.fc";

cell pack_ton_order_data(int status, int side, int quantity, int price, int order_id, slice deployer_address, slice creator_address, slice jetton_master_addres, cell order_code, cell jetton_wallet_code, int expiration_time_t) inline {
    var addresses_cell = begin_cell()
        .store_slice(deployer_address)
        .store_slice(creator_address)
        .store_slice(jetton_master_addres)
        .end_cell();

    return begin_cell()
        .store_uint(status, 3)
        .store_uint(side, 1)
        .store_coins(quantity)
        .store_uint(price, 64)
        .store_uint(order_id, 32)
        .store_ref(addresses_cell)
        .store_ref(order_code)
        .store_ref(jetton_wallet_code)
        .store_uint(expiration_time_t, 64)
        .end_cell();
}

cell calculate_ton_order_state_init(slice deployer_address, int order_id, cell order_code, cell jetton_wallet_code) impure inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(order_code)
        .store_dict(pack_ton_order_data(0, 0, 0, 0, order_id, deployer_address, "", "", order_code, jetton_wallet_code, 0))
        .store_uint(0, 1)
        .end_cell();
}



================================================
FILE: ton-exchange/contracts/imports/utils.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/imports/utils.fc
================================================
#include "stdlib.fc";
#include "opcodes.fc";

int fee::tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int fee::jetton::consumption() asm "16000000 PUSHINT"; ;; 0.016 TON
int fee::deployer::create_consumption() asm "20000000 PUSHINT"; ;; 0.02 TON
int fee::order::create_consumption() asm "30000000 PUSHINT"; ;; 0.03 TON
int fee::order::fill_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON
int fee::order::close_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON


() send_jettons_with_mode(int query_id, int amount, slice to_address, slice from_address, slice excesses_address, int msg_value, int forward_payload_value, int send_mode) impure inline {
    var msg_body = begin_cell()
        .store_uint(op::transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(to_address)
        .store_slice(excesses_address)      ;; response_address for excesses
        .store_uint(0, 1)                   ;; empty custom payload
        .store_coins(forward_payload_value) ;; forward_ton_amount
        .store_uint(0, 8);                  ;; empty payload

    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(from_address)
        .store_coins(msg_value)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_body.end_cell());

    send_raw_message(msg.end_cell(), send_mode);
}

() send_jettons(int query_id, int amount, slice to_address, slice from_address, slice excesses_address, int msg_value, int forward_payload_value) impure inline {
    send_jettons_with_mode(query_id, amount, to_address, from_address, excesses_address, msg_value, forward_payload_value, 2);
}

() send_toncoins(slice to_address, int msg_value) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(to_address)
        .store_coins(msg_value)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

    send_raw_message(msg.end_cell(), 0);
}

() throw_unless_excesses(int exit_code, int cond, int query_id, int amount, slice to_address, slice from_address, slice excesses_address, int msg_value, int forward_payload_value) impure inline {
    if (cond != 0) { ;; if cond == true
        return ();
    }

    send_jettons(query_id, amount, to_address, from_address, excesses_address, msg_value, forward_payload_value);

    commit();
    throw(exit_code);
}

() throw_unless_toncoins_excesses(int exit_code, int cond, slice to_address, int msg_value) impure inline {
    if (cond != 0) { ;; if cond == true
        return ();
    }

    send_toncoins(to_address, msg_value);

    commit();
    throw(exit_code);
}

(slice, slice) unpack_forward_payload(slice in_msg_body) impure inline {
    cell payload_cell = in_msg_body~load_maybe_ref();
    if (cell_null?(payload_cell) == 0) {
        return (in_msg_body, payload_cell.begin_parse());
    }

    return (in_msg_body, in_msg_body);
}



================================================
FILE: ton-exchange/contracts/order.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/order.fc
================================================
#include "imports/constants.fc";
#include "imports/stdlib.fc";
#include "imports/order-utils.fc";
#include "imports/opcodes.fc";
#include "imports/jetton-utils.fc";
#include "imports/order-asserts.fc";
#include "imports/utils.fc";

(int, slice, slice, int, int, int, int, slice, slice, slice, cell, cell, int) load_data() inline {
    slice ds = get_data().begin_parse();
    int status = ds~load_uint(3);
    slice total_base_quote_cell = ds~load_ref().begin_parse();
    int total_amount = total_base_quote_cell~load_coins();
    slice base_wallet_address = slice_bits(total_base_quote_cell) > 0 ? total_base_quote_cell~load_msg_addr() : ""; ;; base_jetton_address
    slice quote_wallet_address = slice_bits(total_base_quote_cell) > 0 ? total_base_quote_cell~load_msg_addr() : ""; ;; quote_jetton_address
    return (
        status, ;; status (0 - not inited, 1 - inited, 2 - filled, 3 - closed, 4 - expired)
        base_wallet_address,
        quote_wallet_address,
        ds~load_uint(1), ;; side (0 - buy or 1 - sell)
        total_amount, ;; total_amount
        ds~load_uint(64), ;; price
        ds~load_uint(32), ;; order_id
        ds~load_msg_addr(), ;; deployer_address
        slice_bits(ds) > 64 ? ds~load_msg_addr() : "", ;; creator_address
        slice_bits(ds) > 64 ? ds~load_msg_addr() : "", ;; wallet_address
        ds~load_ref(), ;; order_code
        ds~load_ref(),       ;; jetton_wallet_code
        ds~load_uint(64) ;; expiration_time_t
    );
}

() save_data(int status, slice base_jetton_address, slice quote_jetton_address, int side, int total_amount, int price, int order_id, slice deployer_address, slice creator_address, slice wallet_address, cell order_code, cell jetton_wallet_code, int expiration_time_t) impure {
    set_data(pack_order_data(status, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t));
}

() init_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    throw_unless(814, slice_bits(in_msg_body) > 0);

    int query_id = in_msg_body~load_uint(64);
    slice creator = in_msg_body~load_msg_addr();

    var (status, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_unless(815, equal_slices(deployer_address, sender_address));
    throw_unless(816, status == status::NOT_INITIALIZED);

    save_data(status::INITIALIZED, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
}

() recall_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    throw_unless(1114, slice_bits(in_msg_body) == 64);
    int query_id = in_msg_body~load_uint(64);

    var (status, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_unless(1115, equal_slices(creator_address, sender_address));
    throw_unless(1116, status == status::FILLED);

    var jetton_wallet_addres = calculate_user_jetton_wallet_address(my_address(), side == side::SELLER ? base_jetton_address : quote_jetton_address, jetton_wallet_code);

    send_jettons_with_mode(query_id, total_amount, creator_address, jetton_wallet_addres, creator_address, 0, 10000000, 128);

    save_data(status::RECALLED, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
}

() fill_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    var (status, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

    int forward_payload_value = fwd_fee + fee::jetton::consumption();
    int transfer_fee = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage()) + forward_payload_value;
    throw_unless_excesses(827, equal_slices(deployer_address, from_address), query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);

    slice payload = in_msg_body~load_ref().begin_parse();
    base_jetton_address = payload~load_msg_addr();
    quote_jetton_address = payload~load_msg_addr();
    side = payload~load_uint(1);
    price = payload~load_uint(64);
    expiration_time_t = payload~load_uint(64);

    int is_correct_side = (side == side::SELLER) | (side == side::BUYER);
    throw_unless_excesses(819, is_correct_side, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);

    wallet_address = sender_address;
    total_amount = jetton_amount;
    save_data(status::FILLED, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
}

() close_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    var (status, base_wallet_address, quote_wallet_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

    int forward_payload_value = fwd_fee + fee::jetton::consumption();
    ;; transfer + internal_transfer + notification
    int transfer_fee = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage()) + forward_payload_value;

    slice either_forward_payload = in_msg_body~unpack_forward_payload();

    throw_unless_excesses(822, slice_bits(either_forward_payload) == 1 + 64, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value); ;; side, price

    int user_side = either_forward_payload~load_uint(1);
    int user_price = either_forward_payload~load_uint(64);

    int fraud = check_if_jetton_wallet_fraud_detected(sender_address, side == side::SELLER ? quote_wallet_address : base_wallet_address, jetton_wallet_code);
    throw_unless_excesses(899, fraud == 0, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);

    int is_correct_side = (side == side::SELLER ? user_side == side::BUYER : user_side == side::SELLER);
    throw_unless_excesses(824, is_correct_side , query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);
    throw_unless_excesses(825, price == user_price, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);

    int user_quantity = calculate_quantity(user_side, jetton_amount, user_price);
    int quantity = calculate_quantity(side, total_amount, user_price);

    int total_quantity = min(user_quantity, quantity);

    ;; remainder
    int remainder = 0;
    if (side == side::SELLER) {
        remainder = jetton_amount - total_quantity * user_price / NORM_FACTOR;
    } else {
        remainder = jetton_amount - total_quantity;
    }

    ;; exchange + current consumption
    int total_consumption = (remainder > 0) ? 3 : 2 * (transfer_fee) + fee::order::close_consumption();
    throw_unless_excesses(950, msg_value > total_consumption, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);

    if (side == side::SELLER) {
        ;; buy order
        send_jettons(query_id, total_quantity * user_price / NORM_FACTOR, creator_address, sender_address, from_address, transfer_fee, forward_payload_value);
        send_jettons(query_id, total_quantity, from_address, wallet_address, from_address, transfer_fee, forward_payload_value);
    } else {
        ;; sell order
        send_jettons(query_id, total_quantity, creator_address, sender_address, from_address, transfer_fee, forward_payload_value);
        send_jettons(query_id, total_quantity * price / NORM_FACTOR, from_address, wallet_address, from_address, transfer_fee, forward_payload_value);
    }

    if (remainder > 0) {
        ;; return jetton excess
        send_jettons(query_id, remainder, from_address, sender_address, from_address, transfer_fee, forward_payload_value);
    }

    ;; current user toncoin excesses
    msg_value -= total_consumption;
    if (msg_value > 0) {
        var msg_excesses = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(from_address)
            .store_coins(msg_value)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_int(0, 8); ;; simple transfer to wallet
        send_raw_message(msg_excesses.end_cell(), 2);
    }

    if (side == side::SELLER) {
        total_amount -= total_quantity;
    } else {
        total_amount -= total_quantity * price / NORM_FACTOR;
    }

    if (total_amount < 0) {
        ;; smth goes wrong
        throw_unless_excesses(1000, 0, query_id, jetton_amount, from_address, sender_address,
                                from_address, transfer_fee, forward_payload_value);
    }

    if (total_amount != 0) {
        save_data(status, base_wallet_address, quote_wallet_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
        return ();
    }

    ;; self destruct, total_amount == 0
    var msg_destruct = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(creator_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_int(0, 8); ;; simple transfer to wallet
    send_raw_message(msg_destruct.end_cell(), 128);

    save_data(status::CLOSED, base_wallet_address, quote_wallet_address, side, 0, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return (); ;; ignore bounced
    }

    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr();                           ;; skip dst
    cs~load_coins();                              ;; skip value
    cs~skip_bits(1);                              ;; skip extracurrency collection
    cs~load_coins();                              ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2);  ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);

    if (op == op::init_order()) {
        init_order(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::recall_order()) {
        recall_order(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::transfer_notification()) {
        slice ds = get_data().begin_parse();
        int status = ds~load_uint(3);

        if (status == status::INITIALIZED) {
            fill_order(in_msg_body, sender_address, msg_value, fwd_fee);
            return ();
        }

        if (status == status::FILLED) {
            close_order(in_msg_body, sender_address, msg_value, fwd_fee);
            return ();
        }

        throw(817);
    }

    throw(0xffff);
}

;; handle timer notification from backend
() recv_external() impure {
    var (status, base_jetton_address, quote_jetton_address, side, total_amount, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();
    if ((status != status::FILLED) | (expiration_time_t == 0) | ((expiration_time_t / 1000) > now())) {
        return ();
    }

    accept_message();

    var jetton_wallet_addres = calculate_user_jetton_wallet_address(my_address(), side == side::SELLER ? base_jetton_address : quote_jetton_address, jetton_wallet_code);

    send_jettons(0, total_amount, creator_address, jetton_wallet_addres, creator_address, 0, 10000000);

    save_data(status::EXPIRED, base_jetton_address, quote_jetton_address, side, 0, price, order_id, deployer_address, creator_address, wallet_address, order_code, jetton_wallet_code, expiration_time_t);
}

(int, slice, slice, int, int, int, int, slice, slice, slice, cell, cell, int) get_order_data() method_id {
    return load_data();
}



================================================
FILE: ton-exchange/contracts/order_deployer.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/order_deployer.fc
================================================
#include "imports/constants.fc";
#include "imports/stdlib.fc";
#include "imports/order-utils.fc";
#include "imports/ton-order/utils.fc";
#include "imports/order-asserts.fc";
#include "imports/opcodes.fc";
#include "imports/out-log.fc";
#include "imports/ton-order/opcodes.fc";
#include "imports/utils.fc";
#include "imports/ton-order/fees.fc";

(slice, int, cell, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
        ds~load_msg_addr(), ;; admin_address
        ds~load_uint(32), ;; current order_id
        ds~load_ref(), ;; order_code
        ds~load_ref(), ;; jetton_wallet_code
        ds~load_ref()       ;; ton_order_code
    );
}

() save_data(slice admin_address, int order_id, cell order_code, cell jetton_wallet_code, cell ton_order_code) impure {
    set_data(begin_cell()
        .store_slice(admin_address)
        .store_uint(order_id, 32)
        .store_ref(order_code)
        .store_ref(jetton_wallet_code)
        .store_ref(ton_order_code)
        .end_cell()
    );
}

() create_ton_order_by_ton(int my_ton_balance, slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    var (owner_address, order_id, order_code, jetton_wallet_code, ton_order_code) = load_data();

    int query_id = in_msg_body~load_uint(64);
    slice jetton_master_address = in_msg_body~load_msg_addr();
    int ton_amount = in_msg_body~load_coins();
    int price = in_msg_body~load_uint(64);
    int expiration_time_t = in_msg_body~load_uint(64);

    int quantity = (ton_amount * NORM_FACTOR) / price;

    ;; reserve tons for storage and current computations
    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = fee::tons_for_storage() - min(ton_balance_before_msg, fee::tons_for_storage());
    msg_value -= (storage_fee + fee::deployer::create_consumption());

    raw_reserve(fee::tons_for_storage(), 0);

    int coins_without_ton_amount = 2 * fwd_fee + fee::ton_order::create_consumption() + fee::tons_for_storage();
    int comission = coins_without_ton_amount * create_order_comission_percent / 100 + fwd_fee;

    int coins_for_deploy = coins_without_ton_amount + comission + ton_amount;
    throw_unless(979, msg_value > coins_for_deploy);

    cell state_init = calculate_ton_order_state_init(my_address(), order_id, ton_order_code, jetton_wallet_code);
    slice new_order_address = calculate_order_address(state_init);

    builder log = begin_cell()
        .store_uint(order_type::TON, 1)
        .store_uint(order_id, 32)
        .store_slice(new_order_address);
    send_log(log);

    ;; deploy and fill ton order
    var msg_body = begin_cell()
        .store_uint(op::init_ton_order(), 32)
        .store_uint(query_id, 64)
        .store_uint(side::BUYER, 1)
        .store_coins(quantity)
        .store_uint(price, 64)
        .store_slice(jetton_master_address)
        .store_slice(sender_address)
        .store_uint(expiration_time_t, 64)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(new_order_address)
        .store_coins(coins_for_deploy)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_uint(1, 1)
        .store_uint(1, 1)
        .store_ref(state_init)
        .store_uint(1, 1)
        .store_ref(msg_body);
    send_raw_message(msg.end_cell(), 0);

    msg_value -= coins_for_deploy;

    ;; commission
    send_toncoins(owner_address, comission);
    msg_value -= comission;

    if (msg_value > 0) {
        ;; exceeses
        var mgs_body = begin_cell()
            .store_uint(0, 32)
            .store_uint(query_id, 64)
            .end_cell();

        var msg = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(sender_address)
            .store_coins(msg_value)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(mgs_body);

        send_raw_message(msg.end_cell(), 2); ;; ignore if error happeps
    }

    save_data(owner_address, order_id + 1, order_code, jetton_wallet_code, ton_order_code);
}

() create_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int my_ton_balance) impure inline {
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr(); ;; jetton's owner address - order creator

    int forward_payload_value = fwd_fee + fee::jetton::consumption();
    int transfer_fee = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage()) + forward_payload_value;

    slice either_forward_payload = in_msg_body~unpack_forward_payload();
    either_forward_payload~skip_bits(32); ;; skip inner op-code

    int is_payload_invalid = check_if_fill_order_payload_invalid(either_forward_payload);
    throw_unless_excesses(714, is_payload_invalid == 0,
        query_id, jetton_amount, from_address, sender_address,
        from_address, transfer_fee, forward_payload_value);

    var (owner_address, order_id, order_code, jetton_wallet_code, ton_order_code) = load_data();

    slice payload = either_forward_payload;
    slice base_jetton_address = payload~load_msg_addr();
    slice quote_jetton_address = payload~load_msg_addr();
    int side = payload~load_uint(1);
    int price = payload~load_uint(64);

    throw_unless_excesses(901, price >= NORM_FACTOR, query_id, jetton_amount, from_address, sender_address,
        from_address, transfer_fee, forward_payload_value);
    ;; instead of order create jetton wallet address we use order deployer
    ;; jetton wallet address because it will be the same currency
    ;; throw_if_jetton_wallet_fraud_detected(sender_address, side == side::SELLER ? base_jetton_address : quote_jetton_address, jetton_wallet_code);
    int fraud = check_if_jetton_wallet_fraud_detected(sender_address, side == side::SELLER ? base_jetton_address : quote_jetton_address, jetton_wallet_code);
    throw_unless_excesses(899, fraud == 0, query_id, jetton_amount, from_address, sender_address,
        from_address, transfer_fee, forward_payload_value);

    ;; reserve tons for storage and current computations
    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = fee::tons_for_storage() - min(ton_balance_before_msg, fee::tons_for_storage());
    msg_value -= (storage_fee + fee::deployer::create_consumption());

    raw_reserve(fee::tons_for_storage(), 0);

    cell state_init = calculate_order_state_init(my_address(), order_id, order_code, jetton_wallet_code);
    slice new_order_address = calculate_order_address(state_init);

    ;; deploy + forward_fee + (transfer + internal_transfer + notification)
    int coins_for_deploy = fwd_fee + fee::order::create_consumption() + fee::tons_for_storage();
    int forward_ton_amount = fwd_fee + fee::order::fill_consumption();
    int jetton_creationg_consumption = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage());
    int comission = (coins_for_deploy + forward_ton_amount + jetton_creationg_consumption) * create_order_comission_percent / 100 + fwd_fee;

    int is_msg_value_ok = msg_value > coins_for_deploy + forward_ton_amount + jetton_creationg_consumption + comission;
    throw_unless_excesses(900, is_msg_value_ok, query_id, jetton_amount, from_address, sender_address,
        from_address, transfer_fee, forward_payload_value);

    ;; reserve tons for deploy
    msg_value -= coins_for_deploy;

    ;; notify about new order
    builder log = begin_cell()
        .store_uint(order_type::JETTON, 1)
        .store_uint(order_id, 32)
        .store_slice(new_order_address);
    send_log(log);

    ;; deploy new order contract
    var msg_body = begin_cell()
        .store_uint(op::init_order(), 32)
        .store_uint(query_id, 64)
        .store_slice(from_address)
        .end_cell();
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(new_order_address)
        .store_coins(coins_for_deploy)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_uint(1, 1)
        .store_uint(1, 1)
        .store_ref(state_init)
        .store_uint(1, 1)
        .store_ref(msg_body);
    send_raw_message(msg.end_cell(), 0);


    ;; commission
    send_toncoins(owner_address, comission);
    msg_value -= comission;

    ;; send jetton to orders wallet
    var order_wallet_msg_body = begin_cell()
        .store_uint(op::transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(new_order_address)
        .store_slice(from_address)     ;; response_address for excesses
        .store_uint(0, 1)              ;; empty custom payload (either dict)
        .store_coins(forward_ton_amount)
        .store_maybe_ref(begin_cell().store_slice(either_forward_payload).end_cell());

    var order_wallet_msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(sender_address) ;; deployer's jetton wallet address
        .store_coins(msg_value)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(order_wallet_msg_body.end_cell());
    send_raw_message(order_wallet_msg.end_cell(), 0);


    save_data(owner_address, order_id + 1, order_code, jetton_wallet_code, ton_order_code);
}

() create_ton_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int my_ton_balance) impure inline {
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr(); ;; jetton's owner address - order creator

    var (owner_address, order_id, order_code, jetton_wallet_code, ton_order_code) = load_data();

    slice payload = in_msg_body~unpack_forward_payload();
    payload~skip_bits(32); ;; skip inner op-code
    slice jetton_master_address = payload~load_msg_addr();
    int price = payload~load_uint(64);
    int expiration_time_t = payload~load_uint(64);

    ;; transfer + internal_transfer + notification
    int forward_payload_value = fwd_fee + fee::jetton::consumption();
    int transfer_fee = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage()) + forward_payload_value;

    int fraud = check_if_jetton_wallet_fraud_detected(sender_address, jetton_master_address, jetton_wallet_code);
    throw_unless_excesses(899, fraud == 0, query_id, jetton_amount, from_address, sender_address,
        from_address, transfer_fee, forward_payload_value);

    int quantity = jetton_amount;
    cell state_init = calculate_ton_order_state_init(my_address(), order_id, ton_order_code, jetton_wallet_code);
    slice new_order_address = calculate_order_address(state_init);

    ;; reserve tons for storage and current computations
    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = fee::tons_for_storage() - min(ton_balance_before_msg, fee::tons_for_storage());
    msg_value -= (storage_fee + fee::deployer::create_consumption());

    raw_reserve(fee::tons_for_storage(), 0);

    ;; deploy + forward_fee + (transfer + internal_transfer + notification)
    int coins_for_deploy = fwd_fee + fee::ton_order::create_consumption() + fee::tons_for_storage();
    int forward_ton_amount = fwd_fee + fee::ton_order::fill_consumption();
    int jetton_consumption = 3 * fwd_fee + 2 * (fee::jetton::consumption() + fee::tons_for_storage());
    int comission = (coins_for_deploy + forward_ton_amount + jetton_consumption) * create_order_comission_percent / 100;
    throw_unless(900, msg_value > coins_for_deploy + forward_ton_amount + jetton_consumption + comission);

    msg_value -= coins_for_deploy;
    ;; deploy
    var msg_body = begin_cell()
        .store_uint(op::init_ton_order(), 32)
        .store_uint(query_id, 64)
        .store_uint(side::SELLER, 1)
        .store_coins(quantity)
        .store_uint(price, 64)
        .store_slice(jetton_master_address)
        .store_slice(from_address)
        .store_uint(expiration_time_t, 64)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(new_order_address)
        .store_coins(coins_for_deploy)
        .store_uint(0, 1 + 4 + 4 + 64 + 32)
        .store_uint(1, 1)
        .store_uint(1, 1)
        .store_ref(state_init)
        .store_uint(1, 1)
        .store_ref(msg_body);
    send_raw_message(msg.end_cell(), 0);

    ;; commission
    send_toncoins(owner_address, comission);
    msg_value -= comission;

    ;; fill
    var order_wallet_msg_body = begin_cell()
        .store_uint(op::transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(new_order_address)
        .store_slice(from_address)     ;; response_address for excesses
        .store_uint(0, 1)              ;; empty custom payload (either dict)
        .store_coins(forward_ton_amount)
        .store_uint(0, 1); ;; no either_fwd_payload

    var order_wallet_msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(sender_address) ;; deployer's jetton wallet address
        .store_coins(msg_value)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(order_wallet_msg_body.end_cell());

    send_raw_message(order_wallet_msg.end_cell(), 0);

    ;; notify about new order
    builder log = begin_cell()
        .store_uint(order_type::TON, 1)
        .store_uint(order_id, 32)
        .store_slice(new_order_address);
    send_log(log);

    save_data(owner_address, order_id + 1, order_code, jetton_wallet_code, ton_order_code);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr();                           ;; skip dst
    cs~load_coins();                              ;; skip value
    cs~skip_bits(1);                              ;; skip extracurrency collection
    cs~load_coins();                              ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2);  ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);

    if (op == op::transfer_notification()) {
        var (slice_left, bits) = in_msg_body.skip_bits(64).load_uint(4);
        slice_left~skip_bits(bits * 8 + 267);

        slice payload = slice_left~unpack_forward_payload();
        int inner_op = payload~load_uint(32);
        if (inner_op == op::notification::create_order()) {
            create_order(in_msg_body, sender_address, msg_value, fwd_fee, my_balance);
            return ();
        }

        if (inner_op == op::notification::create_ton_order()) {
            create_ton_order(in_msg_body, sender_address, msg_value, fwd_fee, my_balance);
            return ();
        }

        throw(0xffff);
    }

    if (op == op::create_ton_order()) {
        create_ton_order_by_ton(my_balance, in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    throw(0xffff);
}

(slice, int, cell, cell, cell) get_order_deployer_data() method_id {
    return load_data();
}

slice get_order_address(int order_id, int orderType) method_id {
    var (_, _, order_code, jetton_wallet_code, ton_order_code) = load_data();

    if (orderType == 0) {
        cell state_init = calculate_order_state_init(my_address(), order_id, order_code, jetton_wallet_code);
        return calculate_order_address(state_init);
    }

    cell state_init = calculate_ton_order_state_init(my_address(), order_id, ton_order_code, jetton_wallet_code);
    return calculate_order_address(state_init);
}



================================================
FILE: ton-exchange/contracts/ton_order.fc
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/contracts/ton_order.fc
================================================
#include "imports/constants.fc";
#include "imports/jetton-utils.fc";
#include "imports/stdlib.fc";
#include "imports/utils.fc";
#include "imports/ton-order/utils.fc";
#include "imports/ton-order/fees.fc";
#include "imports/ton-order/opcodes.fc";
#include "imports/opcodes.fc";
#include "imports/order-asserts.fc";

(int, int, int, int, int, slice, slice, slice, cell, cell, int) load_data() inline {
    slice ds = get_data().begin_parse();
    slice addresses_slice = ds~load_ref().begin_parse();
    return (
        ds~load_uint(3), ;; status (0 - not inited, 1 - inited, 2 - filled, 3 - closed, 4 - expired)
        ds~load_uint(1), ;; side (0 - buy or 1 - sell)
        ds~load_coins(), ;; quantity
        ds~load_uint(64), ;; price
        ds~load_uint(32), ;; order_id
        addresses_slice~load_msg_addr(), ;; deployer_address
        slice_bits(addresses_slice) > 0 ? addresses_slice~load_msg_addr() : "", ;; creator_address
        slice_bits(addresses_slice) > 0 ? addresses_slice~load_msg_addr() : "", ;; jetton_master_addres,
        ds~load_ref(), ;; order_code
        ds~load_ref(), ;; jetton_wallet_code
        ds~load_uint(64) ;; expiration_time_t
    );
}

() save_data(int status, int side, int quantity, int price, int order_id, slice deployer_address, slice creator_address, slice jetton_master_addres, cell order_code, cell jetton_wallet_code, int expiration_time_t) impure {
    set_data(pack_ton_order_data(status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_addres, order_code, jetton_wallet_code, expiration_time_t));
}

() send_tokens(int query_id, int amount, slice to_address, slice from_address, slice excesses_address, int msg_value, int fwd_fee) impure inline {
    var msg_body = begin_cell()
        .store_uint(op::transfer(), 32)
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(to_address)
        .store_slice(excesses_address)      ;; response_address for excesses
        .store_uint(0, 1)                   ;; empty custom payload
        .store_coins(fwd_fee)               ;; forward_ton_amount
        .store_uint(0, 8);                  ;; empty payload

    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(from_address)          ;; who closes order jetton wallet address
        .store_coins(msg_value)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_body.end_cell());

    send_raw_message(msg.end_cell(), 0);
}

() send_ton_mode(int query_id, slice to_address, int ton_amount, int mode) impure inline {
    var mgs_body = begin_cell()
        .store_uint(0, 32)
        .store_uint(query_id, 64)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(to_address)          ;; who closes order jetton wallet address
        .store_coins(ton_amount)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(mgs_body);

    send_raw_message(msg.end_cell(), mode);
}

() send_ton(int query_id, slice to_address, int ton_amount) impure inline {
    send_ton_mode(query_id, to_address, ton_amount, 0);
}


() init_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    ;; throw_unless(911, slice_bits(in_msg_body) == 64 + 1 + 64 + 64 + 267 + 267 + 64);
    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_unless(912, status == status::NOT_INITIALIZED);
    throw_unless(913, equal_slices(deployer_address, sender_address));

    int query_id = in_msg_body~load_uint(64);
    side = in_msg_body~load_uint(1);
    quantity = in_msg_body~load_coins();
    price = in_msg_body~load_uint(64);
    jetton_master_address = in_msg_body~load_msg_addr();
    creator_address = in_msg_body~load_msg_addr();
    expiration_time_t = in_msg_body~load_uint(64);

    ;; if side is seller that means that order is still waiting for jetton to come in
    ;; is side is buyer that means that order is filled
    if (side == side::SELLER) {
        save_data(status::INITIALIZED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
    } else {
        save_data(status::FILLED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
    }
}

() recall_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    throw_unless(2114, slice_bits(in_msg_body) == 64);
    int query_id = in_msg_body~load_uint(64);

    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_unless(2115, equal_slices(creator_address, sender_address));
    throw_unless(2116, status == status::FILLED);

    if (side == side::BUYER) {
        send_ton_mode(query_id, creator_address, 0, 128);
    } else {
        var jetton_wallet_addres = calculate_user_jetton_wallet_address(my_address(), jetton_master_address, jetton_wallet_code);
        send_jettons_with_mode(query_id, quantity, creator_address, jetton_wallet_addres, creator_address, 0, 10000000, 128);
    }

    save_data(status::RECALLED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
}

() close_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int my_ton_balance) impure inline {
    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();
    throw_if_jetton_wallet_fraud_detected(sender_address, jetton_master_address, jetton_wallet_code);

    throw_unless(937, side == side::BUYER);

    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

    throw_unless(928, jetton_amount == quantity);

    ;; reserve tons for storage and current computations
    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = fee::tons_for_storage() - min(ton_balance_before_msg, fee::tons_for_storage());
    msg_value -= (storage_fee + fee::ton_order::close_consumption());

    int ton_amount = fwd_fee + quantity * price / NORM_FACTOR;

    throw_unless(948, msg_value >  3 * fwd_fee + 2 * (fee::jetton::consumption() +  fee::tons_for_storage()));

    cell jetton_wallet_state_init = calculate_jetton_wallet_state_init(my_address(), jetton_master_address, jetton_wallet_code);
    slice order_jetton_wallet_address = calculate_jetton_wallet_address(jetton_wallet_state_init);

    send_ton(query_id, from_address, ton_amount);

    send_tokens(query_id, quantity, creator_address, order_jetton_wallet_address, from_address, msg_value, fwd_fee + fee::jetton::consumption() + fee::tons_for_storage());

    ;; self destruct, quantity == 0
    var msg_destruct = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(creator_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_int(0, 8); ;; simple transfer to wallet
    send_raw_message(msg_destruct.end_cell(), 128);

    save_data(status::CLOSED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
}

() fill_order(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline {
    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_if_jetton_wallet_fraud_detected(sender_address, jetton_master_address, jetton_wallet_code);

    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();

    throw_unless(927, equal_slices(deployer_address, from_address));
    throw_unless(928, jetton_amount == quantity);

    save_data(status::FILLED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
}


() close_order_by_ton(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int my_ton_balance) impure inline {
    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();

    throw_unless(931, status == status::FILLED);
    throw_unless(932, side == side::SELLER);
    throw_unless(934, slice_bits(in_msg_body) == 64); ;; query_id

    int query_id = in_msg_body~load_uint(64);

    int ton_balance_before_msg = my_ton_balance - msg_value;
    int storage_fee = fee::tons_for_storage() - min(ton_balance_before_msg, fee::tons_for_storage());
    msg_value -= (storage_fee + fee::ton_order::close_consumption());
    int ton_amount = quantity * price / NORM_FACTOR + fwd_fee;

    throw_unless(933, msg_value > ton_amount + 3 * fwd_fee + 2 * (fee::jetton::consumption() +  fee::tons_for_storage()));

    cell jetton_wallet_state_init = calculate_jetton_wallet_state_init(my_address(), jetton_master_address, jetton_wallet_code);
    slice order_jetton_wallet_address = calculate_jetton_wallet_address(jetton_wallet_state_init);

    ;; reserve tons for storage and current computations
    send_ton(query_id, creator_address, ton_amount);
    msg_value -= ton_amount;

    send_tokens(query_id, quantity, sender_address, order_jetton_wallet_address, sender_address, msg_value, fwd_fee + fee::jetton::consumption() +  fee::tons_for_storage());

    ;; self destruct, quantity == 0
    var msg_destruct = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(creator_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_int(0, 8); ;; simple transfer to wallet
    send_raw_message(msg_destruct.end_cell(), 128);

    save_data(status::CLOSED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return (); ;; ignore bounced
    }

    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr();                           ;; skip dst
    cs~load_coins();                              ;; skip value
    cs~skip_bits(1);                              ;; skip extracurrency collection
    cs~load_coins();                              ;; skip ihr_fee

    ;; TODO: improve with GETFORWARDFEE opcode
    int fwd_fee = 2 * muldiv(cs~load_coins(), 3, 2);

    int op = in_msg_body~load_uint(32);

    if (op == op::init_ton_order()) {
        init_order(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::recall_ton_order()) {
        recall_order(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    if (op == op::close_ton_order()) {
        close_order_by_ton(in_msg_body, sender_address, msg_value, fwd_fee, my_balance);
        return ();
    }

    if (op == op::transfer_notification()) {
        slice ds = get_data().begin_parse();
        int status = ds~load_uint(3);

        if (status == status::INITIALIZED) {
            fill_order(in_msg_body, sender_address, msg_value, fwd_fee);
            return ();
        }

        if (status == status::FILLED) {
            close_order(in_msg_body, sender_address, msg_value, fwd_fee, my_balance);
            return ();
        }

        throw(917);
    }

    throw(0xffff);
}

;; handle timer notification from backend
() recv_external() impure {
    var (status, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t) = load_data();
    if ((status != status::FILLED) | (expiration_time_t == 0) | (expiration_time_t > now())) {
        return ();
    }

    accept_message();

    if (side == side::BUYER) {
        send_ton_mode(0, creator_address, 0, 128);
    } else {
        var jetton_wallet_addres = calculate_user_jetton_wallet_address(my_address(), jetton_master_address, jetton_wallet_code);
        send_jettons_with_mode(0, quantity, creator_address, jetton_wallet_addres, creator_address, 0, 10000000, 128);
    }


    save_data(status::EXPIRED, side, quantity, price, order_id, deployer_address, creator_address, jetton_master_address, order_code, jetton_wallet_code, expiration_time_t);
}

(int, int, int, int, int, slice, slice, slice, cell, cell, int) get_order_data() method_id {
    return load_data();
}



================================================
FILE: ton-exchange/jest.config.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/jest.config.ts
================================================
import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: ton-exchange/package.json
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/package.json
================================================
{
  "name": "orders",
  "version": "0.1.0",
  "scripts": {
    "start": "blueprint run",
    "build": "blueprint build",
    "test": "jest --verbose",
    "lint": "gts lint",
    "clean": "gts clean",
    "fix": "gts fix",
    "posttest": "npm run lint"
  },
  "devDependencies": {
    "@ton/core": "^0.56.3",
    "@ton/crypto": "^3.2.0",
    "@ton/ton": "^13.11.1",
    "@eslint/js": "^9.1.1",
    "@ton/blueprint": "^0.19.1",
    "@ton/sandbox": "^0.18.0",
    "@ton/test-utils": "^0.4.2",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.7",
    "eslint": "^8.57.0",
    "gts": "^5.3.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "~5.4.5",
    "typescript-eslint": "^7.7.1"
  }
}



================================================
FILE: ton-exchange/scripts/closeOrder.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/closeOrder.ts
================================================
import {Address, beginCell, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';

export async function run(provider: NetworkProvider) {
  const orderAddress = Address.parse(
    'kQCiHFyR_LaO9opddwl3NSOcEcOVj1A12_T1Tpc2BI7xgFZQ'
  );

  // kQBdLnykFt2Vbi7v5Gz7smM_quidjaqLzyD19b1QwUw54JPT -- Buy
  // kQDkPYFZC9w6h-_wZCZ959XBCv6IdLEFWMMqHTLcHFRc4_YH -- Sell
  const jettonWalletAddress = Address.parse(
    'kQBdLnykFt2Vbi7v5Gz7smM_quidjaqLzyD19b1QwUw54JPT'
  );
  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddress)
  );

  const price = 1;
  const side = 1;
  const queryId = 9;

  await jettonWallet.sendTransferSlice(provider.sender(), {
    value: toNano(1),
    fwdAmount: toNano(0.7),
    queryId,
    jettonAmount: toNano(1n),
    toAddress: orderAddress,
    forwardPayload: beginCell()
      .storeUint(side, 1)
      .storeUint(price, 64)
      .endCell().beginParse(),
  });
}



================================================
FILE: ton-exchange/scripts/closeTonOrderByJetton.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/closeTonOrderByJetton.ts
================================================
import {Address, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';

export async function run(provider: NetworkProvider) {
  const orderAddress = Address.parse(
    'kQAcQnHPrttTdBd4ixK0eKADEAu7RaoUIU_CdMmxamfN1FVL'
  );
  const jettonWalletAddress = Address.parse(
    'kQD8tWAMJm8SxhFROlgTErqGlNJf1a9TOIwBjUCe_00qUYqj'
  );

  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddress)
  );

  await jettonWallet.sendTransfer(provider.sender(), {
    value: toNano(1),
    fwdAmount: toNano(0.9),
    queryId: 9,
    jettonAmount: toNano(0.5),
    toAddress: orderAddress,
  });
}



================================================
FILE: ton-exchange/scripts/closeTonOrderByTon.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/closeTonOrderByTon.ts
================================================
import {Address, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {TonOrder} from '../wrappers/TonOrder';

export async function run(provider: NetworkProvider) {
  const orderAddress = Address.parse(
    'kQDs5_rY6v7IvQk8zRYg4_a62zLz9Fww35pxZq5cyal6GXw-'
  );

  const order = provider.open(TonOrder.createFromAddress(orderAddress));
  await order.sendClose(provider.sender(), {value: toNano(10.3), queryId: 9});
}



================================================
FILE: ton-exchange/scripts/createOrder.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/createOrder.ts
================================================
import {Address, beginCell, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';
import {ORDER_DEPLOYER_ADDRESS} from './index';

export async function run(provider: NetworkProvider) {
  const baseMasterAddress = Address.parse(
    'kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl'
  );
  const quoteMasterAddress = Address.parse(
    'kQCXIMgabnmqaEUspkO0XlSPS4t394YFBlIg0Upygyw3fuSL'
  );

  // kQBdLnykFt2Vbi7v5Gz7smM_quidjaqLzyD19b1QwUw54JPT -- GLEB'S Buy
  // kQDkPYFZC9w6h-_wZCZ959XBCv6IdLEFWMMqHTLcHFRc4_YH -- GLEB'S Sell
  const jettonWalletAddress = Address.parse(
    'kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiU'
  );
  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddress)
  );

  const price = 1e9;
  const side = 0;
  const queryId = 7;

  await jettonWallet.sendTransfer(provider.sender(), {
    value: toNano(1),
    fwdAmount: toNano(0.7),
    queryId,
    jettonAmount: toNano(1),
    toAddress: ORDER_DEPLOYER_ADDRESS,
    forwardPayload: beginCell()
      .storeUint(0x26de15e1, 32)
      .storeAddress(baseMasterAddress)
      .storeAddress(quoteMasterAddress)
      .storeUint(side, 1)
      .storeUint(price, 64)
      .storeUint(Math.ceil(Date.now() / 1000) + 1000, 64)
      .endCell(),
  });
}



================================================
FILE: ton-exchange/scripts/createTonOrder.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/createTonOrder.ts
================================================
import {Address, beginCell, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';
import {ORDER_DEPLOYER_ADDRESS} from './index';

export async function run(provider: NetworkProvider) {
  const jettonWalletAddress = Address.parse(
    'kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiU'
  );
  const jettonWalletMasterAddress = Address.parse(
    'kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl'
  );

  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddress)
  );

  const price = 1e9;
  await jettonWallet.sendTransfer(provider.sender(), {
    value: toNano(1),
    fwdAmount: toNano(0.7),
    queryId: 9,
    jettonAmount: toNano(1n),
    toAddress: ORDER_DEPLOYER_ADDRESS,
    forwardPayload: beginCell()
      .storeUint(0x26de15e2, 32)
      .storeAddress(jettonWalletMasterAddress)
      .storeUint(price, 64)
      .storeUint(Math.ceil(Date.now() / 1000) + 1000, 64)
      .endCell(),
  });
}



================================================
FILE: ton-exchange/scripts/createTonOrderByTon.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/createTonOrderByTon.ts
================================================
import {Address, toNano} from '@ton/core';
import {NetworkProvider} from '@ton/blueprint';
import {OrderDeployer} from '../wrappers/OrderDeployer';
import {ORDER_DEPLOYER_ADDRESS} from './index';

export async function run(provider: NetworkProvider) {
  const jettonMasterAddress = Address.parse(
    'kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl'
  );

  const orderDeployer = provider.open(
    OrderDeployer.createFromAddress(ORDER_DEPLOYER_ADDRESS)
  );

  const price = 1e9;
  await orderDeployer.sendCreateTonOrder(provider.sender(), {
    queryId: 9,
    value: toNano(1),
    price,
    jettonMasterAddress,
    expirationTime: 0,
    tonAmount: toNano(0.5),
  });
}



================================================
FILE: ton-exchange/scripts/deployOrderDeployer.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/deployOrderDeployer.ts
================================================
import {Address, toNano} from '@ton/core';
import {OrderDeployer} from '../wrappers/OrderDeployer';
import {compile, NetworkProvider} from '@ton/blueprint';
import {JettonMaster} from '@ton/ton';

export async function run(provider: NetworkProvider) {
  const jettonMasterWallet = provider.open(
    JettonMaster.create(
      Address.parse('kQBWwN8SW6Rc_wHl3hnXYLTCWKPk3-VWtuhib3KMg0Wsqdbl')
    )
  );

  const {walletCode} = await jettonMasterWallet.getJettonData();

  const orderDeployer = provider.open(
    OrderDeployer.createFromConfig(
      {
        admin:
          provider.sender().address ??
          Address.parse('0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu'),
        orderId: 0,
        orderCode: await compile('Order'),
        jettonWalletCode: walletCode,
        tonOrderCode: await compile('TonOrder'),
      },
      await compile('OrderDeployer')
    )
  );

  await orderDeployer.sendDeploy(provider.sender(), toNano('0.05'));
  await provider.waitForDeploy(orderDeployer.address);
}



================================================
FILE: ton-exchange/scripts/index.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/scripts/index.ts
================================================
import {Address} from '@ton/core';

export const ORDER_DEPLOYER_ADDRESS = Address.parse(
  'kQA-SSrETDMsdzjUd0bgUb_xEyhIHFJ-lqbSvLOsUjSlANB6'
);



================================================
FILE: ton-exchange/tests/OrderDeployer.TonOrder.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/tests/OrderDeployer.TonOrder.spec.ts
================================================
import {Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {beginCell, Cell, toNano} from '@ton/core';
import '@ton/test-utils';
import {compile} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';
import {JettonMinter} from '../wrappers/JettonMinter';
import {TonOrder} from '../wrappers/TonOrder';
import {OrderDeployer} from '../wrappers/OrderDeployer';

const NORM_FACTOR = 10 ** 9;

describe('OrderDeployer.TonOrder', () => {
  let orderDeployerCode;
  let orderCode: Cell;
  let tonOrderCode: Cell;
  let jettonWalletCode: Cell;
  let jettonMinterCode: Cell;

  let jettonMinter: SandboxContract<JettonMinter>;

  let blockchain: Blockchain;

  let deployer: SandboxContract<TreasuryContract>;
  let orderDeployer: SandboxContract<OrderDeployer>;
  let order: SandboxContract<TonOrder>;

  let seller: SandboxContract<TreasuryContract>;
  let buyer: SandboxContract<TreasuryContract>;

  let orderDeployerJettonWallet: SandboxContract<JettonWallet>;
  let sellerJettonWallet: SandboxContract<JettonWallet>;

  const jettonAmount = 10n;

  beforeAll(async () => {
    blockchain = await Blockchain.create();

    [
      orderDeployerCode,
      orderCode,
      tonOrderCode,
      jettonMinterCode,
      jettonWalletCode,
    ] = await Promise.all([
      compile('OrderDeployer'),
      compile('Order'),
      compile('TonOrder'),
      compile('JettonMinter'),
      compile('JettonWallet'),
    ]);
    deployer = await blockchain.treasury('deployer');
    seller = await blockchain.treasury('seller');
    buyer = await blockchain.treasury('buyer');

    orderDeployer = blockchain.openContract(
      OrderDeployer.createFromConfig(
        {
          tonOrderCode,
          orderCode,
          jettonWalletCode,
          admin: deployer.address,
          orderId: 0,
        },
        orderDeployerCode
      )
    );
    jettonMinter = blockchain.openContract(
      JettonMinter.createFromConfig(
        {
          jettonWalletCode,
          adminAddress: deployer.address,
          content: beginCell().storeStringTail('minter').endCell(),
        },
        jettonMinterCode
      )
    );
    await jettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));

    await jettonMinter.sendMint(deployer.getSender(), {
      jettonAmount: toNano(3),
      queryId: 9,
      toAddress: seller.address,
      amount: toNano(2),
      value: toNano(2),
    });

    sellerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await jettonMinter.getWalletAddress(seller.address)
      )
    );
  });

  it('should deploy', async () => {
    const {transactions} = await orderDeployer.sendDeploy(
      deployer.getSender(),
      toNano(0.05)
    );
    expect(transactions).toHaveTransaction({
      from: deployer.address,
      to: orderDeployer.address,
      deploy: true,
      success: true,
    });

    orderDeployerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await jettonMinter.getWalletAddress(orderDeployer.address)
      )
    );
  });

  it('should create order by jetton', async () => {
    const price = 10 * NORM_FACTOR;
    const expirationTime = Math.ceil(Date.now() / 1000) + 1000;

    const result = await sellerJettonWallet.sendTransfer(seller.getSender(), {
      value: toNano(2),
      fwdAmount: toNano(0.6),
      queryId: 9,
      jettonAmount,
      toAddress: orderDeployer.address,
      forwardPayload: beginCell()
        .storeUint(0x26de15e2, 32)
        .storeAddress(jettonMinter.address)
        .storeUint(price, 64)
        .storeUint(expirationTime, 64)
        .endCell(),
    });

    const {address: newOrderAddress} = await orderDeployer.getOrderAddress(
      0,
      1
    );
    const orderJettonWalletAddress =
      await jettonMinter.getWalletAddress(newOrderAddress);
    const orderJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(orderJettonWalletAddress)
    );

    expect(result.transactions).toHaveTransaction({
      from: orderDeployer.address,
      to: newOrderAddress,
      deploy: true,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: orderDeployerJettonWallet.address,
      to: orderJettonWallet.address,
      success: true,
    });

    const order = blockchain.openContract(
      TonOrder.createFromAddress(newOrderAddress)
    );
    const orderData = await order.getOrderData();

    expect(orderData.status).toEqual(2);
    expect(orderData.price).toEqual(price);
    expect(orderData.quantity).toEqual(Number(jettonAmount));
    expect(orderData.expirationTime).toEqual(expirationTime);
  });

  it('should create order ton', async () => {
    const price = 0x9502f900;
    const expirationTime = 0;
    const tonAmount = toNano(5n);

    const result = await orderDeployer.sendCreateTonOrder(buyer.getSender(), {
      value: toNano(5.5),
      queryId: 9,
      tonAmount,
      expirationTime,
      price,
      jettonMasterAddress: jettonMinter.address,
    });

    const {address: newOrderAddress} = await orderDeployer.getOrderAddress(
      1,
      1
    );
    expect(result.transactions).toHaveTransaction({
      from: orderDeployer.address,
      to: newOrderAddress,
      deploy: true,
      success: true,
    });

    order = blockchain.openContract(
      TonOrder.createFromAddress(newOrderAddress)
    );

    const orderData = await order.getOrderData();

    expect(orderData.status).toEqual(2);
    expect(orderData.price).toEqual(price);
    expect(orderData.quantity).toEqual(
      Number(tonAmount) / (price / NORM_FACTOR)
    );
    expect(orderData.expirationTime).toEqual(expirationTime);
  });

  it('should close order by jetton', async () => {
    const result = await sellerJettonWallet.sendTransfer(seller.getSender(), {
      value: toNano(1),
      fwdAmount: toNano(0.7),
      queryId: 9,
      jettonAmount: toNano(2),
      toAddress: order.address,
    });

    expect(result.transactions).toHaveTransaction({
      from: order.address,
      to: buyer.address,
      success: true,
    });
  });
});



================================================
FILE: ton-exchange/tests/OrderDeployer.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/tests/OrderDeployer.spec.ts
================================================
import {Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {Address, beginCell, Cell, toNano} from '@ton/core';
import '@ton/test-utils';
import {compile} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';
import {JettonMinter} from '../wrappers/JettonMinter';
import {Order} from '../wrappers/Order';
import {OrderDeployer} from '../wrappers/OrderDeployer';

describe('OrderDeployer', () => {
  let orderDeployerCode: Cell;
  let orderCode: Cell;
  let tonOrderCode: Cell;
  let jettonWalletCode: Cell;
  let jettonMinterCode: Cell;

  let orderAddress: Address;

  let firstJettonMinter: SandboxContract<JettonMinter>;
  let secondJettonMinter: SandboxContract<JettonMinter>;

  let blockchain: Blockchain;

  let deployer: SandboxContract<TreasuryContract>;
  let orderDeployer: SandboxContract<OrderDeployer>;
  let order: SandboxContract<Order>;

  let seller: SandboxContract<TreasuryContract>;
  let buyer: SandboxContract<TreasuryContract>;

  let orderDeployerJettonWallet: SandboxContract<JettonWallet>;
  let orderJettonWallet: SandboxContract<JettonWallet>;
  let sellerJettonWallet: SandboxContract<JettonWallet>;
  let sellerSecondJettonWallet: SandboxContract<JettonWallet>;
  let buyerJettonWallet: SandboxContract<JettonWallet>;
  let buyerSecondJettonWallet: SandboxContract<JettonWallet>;

  const totalAmount = 1000000000000n;

  beforeAll(async () => {
    blockchain = await Blockchain.create();

    [
      orderDeployerCode,
      orderCode,
      tonOrderCode,
      jettonMinterCode,
      jettonWalletCode,
    ] = await Promise.all([
      compile('OrderDeployer'),
      compile('Order'),
      compile('TonOrder'),
      compile('JettonMinter'),
      compile('JettonWallet'),
    ]);
    deployer = await blockchain.treasury('deployer');
    seller = await blockchain.treasury('seller');
    buyer = await blockchain.treasury('buyer');

    orderDeployer = blockchain.openContract(
      OrderDeployer.createFromConfig(
        {
          tonOrderCode,
          orderCode,
          jettonWalletCode,
          admin: deployer.address,
          orderId: 0,
        },
        orderDeployerCode
      )
    );

    firstJettonMinter = blockchain.openContract(
      JettonMinter.createFromConfig(
        {
          jettonWalletCode,
          adminAddress: deployer.address,
          content: beginCell().storeStringTail('firstminter').endCell(),
        },
        jettonMinterCode
      )
    );
    await firstJettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));
    await firstJettonMinter.sendMint(deployer.getSender(), {
      jettonAmount: totalAmount,
      queryId: 9,
      toAddress: seller.address,
      amount: toNano(1),
      value: toNano(2),
    });

    secondJettonMinter = blockchain.openContract(
      JettonMinter.createFromConfig(
        {
          jettonWalletCode,
          adminAddress: deployer.address,
          content: beginCell().storeStringTail('secondminter').endCell(),
        },
        jettonMinterCode
      )
    );
    await secondJettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));
    await secondJettonMinter.sendMint(deployer.getSender(), {
      jettonAmount: totalAmount,
      queryId: 9,
      toAddress: buyer.address,
      amount: toNano(1),
      value: toNano(2),
    });

    sellerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await firstJettonMinter.getWalletAddress(seller.address)
      )
    );
    sellerSecondJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await secondJettonMinter.getWalletAddress(seller.address)
      )
    );
    buyerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await secondJettonMinter.getWalletAddress(buyer.address)
      )
    );
    buyerSecondJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await firstJettonMinter.getWalletAddress(buyer.address)
      )
    );
  });

  it('should deploy', async () => {
    const {transactions} = await orderDeployer.sendDeploy(
      deployer.getSender(),
      toNano(0.05)
    );
    expect(transactions).toHaveTransaction({
      from: deployer.address,
      to: orderDeployer.address,
      deploy: true,
      success: true,
    });

    const orderDeployerData = await orderDeployer.getOrderDeployerData();

    expect(orderDeployerData.orderId).toEqual(0);
    expect(orderDeployerData.admin).toEqualAddress(deployer.address);

    orderDeployerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await firstJettonMinter.getWalletAddress(orderDeployer.address)
      )
    );
  });

  async function createOrder(
    jettonAmount: bigint,
    side: number,
    price: number,
    expirationTime: number
  ) {
    const {orderId} = await orderDeployer.getOrderDeployerData();
    const result = await sellerJettonWallet.sendTransfer(seller.getSender(), {
      value: toNano(1),
      fwdAmount: toNano(0.6),
      queryId: 9,
      jettonAmount,
      toAddress: orderDeployer.address,
      forwardPayload: beginCell()
        .storeUint(0x26de15e1, 32)
        .storeAddress(firstJettonMinter.address) // base_jetton_address
        .storeAddress(secondJettonMinter.address) // quote_jetton_address
        .storeUint(side, 1)
        .storeUint(price, 64)
        .storeUint(expirationTime, 64)
        .endCell(),
    });

    const {address: newOrderAddress} = await orderDeployer.getOrderAddress(
      orderId,
      0
    );

    orderAddress = newOrderAddress;

    const orderJettonWalletAddress =
      await firstJettonMinter.getWalletAddress(orderAddress);
    orderJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(orderJettonWalletAddress)
    );

    expect(result.transactions).toHaveTransaction({
      from: seller.address,
      to: sellerJettonWallet.address,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: orderDeployerJettonWallet.address,
      to: orderDeployer.address,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: orderDeployer.address,
      to: newOrderAddress,
      deploy: true,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: orderDeployerJettonWallet.address,
      to: orderJettonWallet.address,
      success: true,
    });

    order = blockchain.openContract(Order.createFromAddress(newOrderAddress));
    return await order.getOrderData();
  }

  it('should create order', async () => {
    const expirationTime = Math.ceil(Date.now() / 1000) + 1000;
    const side = 0;
    const price = 2.85 * Math.pow(10, 9);
    const jettonAmount = toNano(0.7);
    const orderData = await createOrder(
      jettonAmount,
      side,
      price,
      expirationTime
    );

    expect(orderData.status).toEqual(2);
    expect(orderData.price).toEqual(price);
    expect(orderData.totalAmount).toEqual(jettonAmount);
    expect(orderData.expirationTime).toEqual(expirationTime);

    const orderDeployerData = await orderDeployer.getOrderDeployerData();
    expect(orderDeployerData.orderId).toEqual(1);

    const orderJettonAmount = await orderJettonWallet.getWalletJettonAmount();
    expect(orderJettonAmount).toEqual(jettonAmount);

    const sellerJettonAmount = await sellerJettonWallet.getWalletJettonAmount();
    expect(sellerJettonAmount).toEqual(totalAmount - jettonAmount);
  });

  it('should partially close', async () => {
    const jettonAmount = toNano(0.4);
    const side = 1;
    const price = 2.85 * Math.pow(10, 9);

    const result = await buyerJettonWallet.sendTransfer(buyer.getSender(), {
      value: toNano(2),
      fwdAmount: toNano(1),
      queryId: 9,
      jettonAmount,
      toAddress: order.address,
      forwardPayload: beginCell()
        .storeUint(side, 1)
        .storeUint(price, 64)
        .endCell(),
    });

    const orderJettonWalletAddress =
      await secondJettonMinter.getWalletAddress(orderAddress);
    const buyerOrderJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(orderJettonWalletAddress)
    );

    expect(result.transactions).toHaveTransaction({
      from: buyer.address,
      to: buyerJettonWallet.address,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: buyerJettonWallet.address,
      to: buyerOrderJettonWallet.address,
      success: true,
      deploy: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: buyerOrderJettonWallet.address,
      to: order.address,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: buyerOrderJettonWallet.address,
      to: sellerSecondJettonWallet.address,
      success: true,
    });
    expect(result.transactions).toHaveTransaction({
      from: orderJettonWallet.address,
      to: buyerSecondJettonWallet.address,
      success: true,
    });

    const orderData = await order.getOrderData();
    expect(orderData.status).toEqual(2);
    expect(orderData.totalAmount).toEqual(
      BigInt(0.7 * Math.pow(10, 9) - Math.floor((0.4 * Math.pow(10, 9)) / 2.85))
    );
    console.log(orderData.totalAmount);

    const orderJettonAmount = await orderJettonWallet.getWalletJettonAmount();
    expect(orderJettonAmount).toEqual(orderData.totalAmount);

    const buyerJettonAmount = await buyerJettonWallet.getWalletJettonAmount();
    expect(buyerJettonAmount).toEqual(
      BigInt(
        Math.pow(10, 12) -
          Math.floor(2.85 * Math.floor((0.4 * Math.pow(10, 9)) / 2.85))
      )
    );

    const buyerSecondJettonAmount =
      await buyerSecondJettonWallet.getWalletJettonAmount();
    expect(buyerSecondJettonAmount).toEqual(
      BigInt(Math.floor((0.4 * Math.pow(10, 9)) / 2.85))
    );

    // partial close
    const sellerSecondJettonAmount =
      await sellerSecondJettonWallet.getWalletJettonAmount();
    expect(sellerSecondJettonAmount).toEqual(
      BigInt(Math.floor(2.85 * Math.floor((0.4 * Math.pow(10, 9)) / 2.85)))
    );
  });

  it('should fully close', async () => {
    const jettonAmount = toNano(2); // need approx 1.6 to close, but check jetton excess
    const side = 1;
    const price = 2.85 * Math.pow(10, 9);

    const result = await buyerJettonWallet.sendTransferSlice(
      buyer.getSender(),
      {
        value: toNano(2),
        fwdAmount: toNano(1),
        queryId: 9,
        jettonAmount,
        toAddress: order.address,
        forwardPayload: beginCell()
          .storeUint(side, 1)
          .storeUint(price, 64)
          .endCell()
          .beginParse(),
      }
    );

    expect(result.transactions).toHaveTransaction({
      from: buyer.address,
      to: buyerJettonWallet.address,
      success: true,
    });

    const orderData = await order.getOrderData();
    expect(orderData.status).toEqual(3);
    expect(orderData.totalAmount).toEqual(0n);

    const orderJettonAmount = await orderJettonWallet.getWalletJettonAmount();
    expect(orderJettonAmount).toEqual(orderData.totalAmount);

    const buyerJettonAmount = await buyerJettonWallet.getWalletJettonAmount();
    // first balance - partial close - full close
    expect(buyerJettonAmount).toEqual(
      BigInt(
        Math.pow(10, 12) -
          Math.floor(2.85 * Math.floor((0.4 * Math.pow(10, 9)) / 2.85)) -
          Math.floor(2.85 * 559649123)
      )
    );

    const buyerSecondJettonAmount =
      await buyerSecondJettonWallet.getWalletJettonAmount();
    expect(buyerSecondJettonAmount).toEqual(toNano(0.7));

    const sellerSecondJettonAmount =
      await sellerSecondJettonWallet.getWalletJettonAmount();
    // partial close + full close
    expect(sellerSecondJettonAmount).toEqual(
      BigInt(
        Math.floor(2.85 * Math.floor((0.4 * Math.pow(10, 9)) / 2.85)) +
          Math.floor(2.85 * 559649123)
      )
    );
  });

  it('should not create order - invalid payload', async () => {
    const side = 0;
    const price = 5 * Math.pow(10, 9);
    const jettonAmount = 100n;

    let sellerJettonAmount = await sellerJettonWallet.getWalletJettonAmount();
    expect(sellerJettonAmount).toEqual(totalAmount - toNano(0.7));

    // invalid payload - no timestamp
    const result = await sellerJettonWallet.sendTransfer(seller.getSender(), {
      value: toNano(1),
      fwdAmount: toNano(0.6),
      queryId: 9,
      jettonAmount,
      toAddress: orderDeployer.address,
      forwardPayload: beginCell()
        .storeUint(0x26de15e1, 32)
        .storeAddress(firstJettonMinter.address) // base_jetton_address
        .storeAddress(secondJettonMinter.address) // quote_jetton_address
        .storeUint(side, 1)
        .storeUint(price, 64)
        .endCell(),
    });

    const orderDeployerData = await orderDeployer.getOrderDeployerData();
    expect(orderDeployerData.orderId).toEqual(1);

    expect(result.transactions).toHaveTransaction({
      from: orderDeployerJettonWallet.address,
      to: orderDeployer.address,
      success: true,
      exitCode: 714,
    });

    sellerJettonAmount = await sellerJettonWallet.getWalletJettonAmount();
    expect(sellerJettonAmount).toEqual(totalAmount - toNano(0.7));
  });

  it('should recall order', async () => {
    const side = 0;
    const price = 5 * Math.pow(10, 9);
    const jettonAmount = 100n;

    await createOrder(jettonAmount, side, price, 0);

    const firstAmount = await sellerJettonWallet.getWalletJettonAmount();

    const res = await order.sendRecall(seller.getSender(), toNano(0.2));

    expect(res.transactions).toHaveTransaction({
      from: sellerJettonWallet.address,
      to: seller.address,
      success: true,
    });

    const secondAmount = await sellerJettonWallet.getWalletJettonAmount();

    expect(secondAmount - firstAmount).toEqual(jettonAmount);
  });
});



================================================
FILE: ton-exchange/tests/TonOrder.spec.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/tests/TonOrder.spec.ts
================================================
import {
  Blockchain,
  BlockchainSnapshot,
  SandboxContract,
  TreasuryContract,
} from '@ton/sandbox';
import {beginCell, Cell, toNano} from '@ton/core';
import '@ton/test-utils';
import {compile} from '@ton/blueprint';
import {JettonWallet} from '../wrappers/JettonWallet';
import {JettonMinter} from '../wrappers/JettonMinter';
import {TonOrder} from '../wrappers/TonOrder';

const NORM_FACTOR = 10 ** 9;

describe('TonOrder', () => {
  let orderCode: Cell;
  let jettonWalletCode: Cell;
  let jettonMinterCode: Cell;

  let jettonMinter: SandboxContract<JettonMinter>;

  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;

  let order: SandboxContract<TonOrder>;

  let seller: SandboxContract<TreasuryContract>;

  let deployerJettonWallet: SandboxContract<JettonWallet>;
  let sellerJettonWallet: SandboxContract<JettonWallet>;

  let orderJettonWallet: SandboxContract<JettonWallet>;

  const jettonAmount = 10n;

  beforeAll(async () => {
    blockchain = await Blockchain.create();

    [orderCode, jettonMinterCode, jettonWalletCode] = await Promise.all([
      compile('TonOrder'),
      compile('JettonMinter'),
      compile('JettonWallet'),
    ]);

    deployer = await blockchain.treasury('deployer');
    seller = await blockchain.treasury('seller');

    jettonMinter = blockchain.openContract(
      JettonMinter.createFromConfig(
        {
          jettonWalletCode,
          adminAddress: deployer.address,
          content: beginCell().storeStringTail('minter').endCell(),
        },
        jettonMinterCode
      )
    );

    await jettonMinter.sendDeploy(deployer.getSender(), toNano(0.25));

    await jettonMinter.sendMint(deployer.getSender(), {
      jettonAmount,
      queryId: 9,
      toAddress: deployer.address,
      amount: toNano(1),
      value: toNano(2),
    });

    deployerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await jettonMinter.getWalletAddress(deployer.address)
      )
    );
    sellerJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await jettonMinter.getWalletAddress(seller.address)
      )
    );

    order = blockchain.openContract(
      TonOrder.createFromConfig(
        {
          status: 0,
          side: 0,
          quantity: 0,
          price: 0,
          deployerAddress: deployer.address,
          orderId: 1,
          orderCode,
          jettonWalletCode,
          expirationTime: 0,
        },
        orderCode
      )
    );

    orderJettonWallet = blockchain.openContract(
      JettonWallet.createFromAddress(
        await jettonMinter.getWalletAddress(order.address)
      )
    );
  });

  it('should deploy', async () => {
    const expirationTime = Math.ceil(Date.now() / 1000) + 1000;
    const side = 0;
    const price = 1.5 * NORM_FACTOR;

    const result = await order.sendDeploy(deployer.getSender(), toNano(1), {
      side,
      queryId: 9,
      expirationTime,
      price,
      quantity: Number(jettonAmount),
      jettonMasterAddress: jettonMinter.address,
      creatorAddress: seller.address,
    });

    expect(result.transactions).toHaveTransaction({
      from: deployer.address,
      to: order.address,
      deploy: true,
      success: true,
    });

    const orderData = await order.getOrderData();

    expect(orderData.status).toEqual(1);
    expect(orderData.creatorAddress).toEqualAddress(seller.address);
  });

  let initializedSnapshot: BlockchainSnapshot;
  it('should initialize', async () => {
    await deployerJettonWallet.sendTransfer(deployer.getSender(), {
      queryId: 9,
      toAddress: order.address,
      value: toNano(1),
      fwdAmount: toNano(0.2),
      jettonAmount,
    });

    const orderData = await order.getOrderData();
    expect(orderData.status).toEqual(2);

    initializedSnapshot = blockchain.snapshot();
  });

  it('should close', async () => {
    await order.sendClose(seller.getSender(), {
      value: toNano(1),
      queryId: 9,
    });

    const orderData = await order.getOrderData();
    expect(orderData.status).toEqual(3);

    const orderJettonAmount = await orderJettonWallet.getWalletJettonAmount();
    expect(orderJettonAmount).toEqual(0n);

    const sellerJettonAmount = await sellerJettonWallet.getWalletJettonAmount();
    expect(sellerJettonAmount).toEqual(jettonAmount);
  });

  it('should recall close', async () => {
    await blockchain.loadFrom(initializedSnapshot);

    const res = await order.sendRecall(seller.getSender(), {
      value: toNano(1),
      queryId: 9,
    });

    expect(res.transactions).toHaveTransaction({
      from: order.address,
      to: seller.address,
      success: true,
    });

    const orderData = await order.getOrderData();
    expect(orderData.status).toEqual(5);
  });
});



================================================
FILE: ton-exchange/wrappers/ExchangeConstants.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/ExchangeConstants.ts
================================================
export const Opcodes = {
  transfer: 0xf8a7ea5,
  transfer_notification: 0x7362d09c,
  init_order: 0x25de17e2,
};



================================================
FILE: ton-exchange/wrappers/JettonMinter.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/JettonMinter.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/ft/jetton-minter.fc'],
};



================================================
FILE: ton-exchange/wrappers/JettonMinter.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/JettonMinter.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleItemSlice,
} from '@ton/core';

export type JettonMinterConfig = {
  adminAddress: Address;
  content: Cell;
  jettonWalletCode: Cell;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.adminAddress)
    .storeRef(config.content)
    .storeRef(config.jettonWalletCode)
    .endCell();
}

export class JettonMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMinter(address);
  }

  static createFromConfig(
    config: JettonMinterConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonMinterConfigToCell(config);
    const init = {code, data};
    return new JettonMinter(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendMint(
    provider: ContractProvider,
    via: Sender,
    opts: {
      toAddress: Address;
      jettonAmount: bigint;
      amount: bigint;
      queryId: number;
      value: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(21, 32)
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.toAddress)
        .storeCoins(opts.amount)
        .storeRef(
          beginCell()
            .storeUint(0x178d4519, 32)
            .storeUint(opts.queryId, 64)
            .storeCoins(opts.jettonAmount)
            .storeAddress(this.address)
            .storeAddress(this.address)
            .storeCoins(0)
            .storeUint(0, 1)
            .endCell()
        )
        .endCell(),
    });
  }

  async getWalletAddress(
    provider: ContractProvider,
    address: Address
  ): Promise<Address> {
    const result = await provider.get('get_wallet_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(address).endCell(),
      } as TupleItemSlice,
    ]);

    return result.stack.readAddress();
  }

  async getTotalSupply(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('get_jetton_data', []);
    return result.stack.readBigNumber();
  }
}



================================================
FILE: ton-exchange/wrappers/JettonWallet.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/JettonWallet.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/ft/jetton-wallet.fc'],
};



================================================
FILE: ton-exchange/wrappers/JettonWallet.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/JettonWallet.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Slice,
} from '@ton/core';
import {Maybe} from '@ton/ton/dist/utils/maybe';

export type JettonWalletConfig = {
  ownerAddress: Address;
  minterAddress: Address;
  walletCode: Cell;
};

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.ownerAddress)
    .storeAddress(config.minterAddress)
    .storeRef(config.walletCode)
    .endCell();
}

export class JettonWallet implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new JettonWallet(address);
  }

  static createFromConfig(
    config: JettonWalletConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonWalletConfigToCell(config);
    const init = {code, data};
    return new JettonWallet(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
      forwardPayload?: Maybe<Cell>;
    }
  ) {
    const builder = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(opts.queryId, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount);

    builder.storeMaybeRef(opts.forwardPayload);
    // console.log(builder.endCell().toString());
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async sendTransferSlice(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
      forwardPayload: Slice;
    }
  ) {
    const builder = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(opts.queryId, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount)
      .storeUint(0, 1)
      .storeSlice(opts.forwardPayload);

    // console.log(builder.endCell().toString());
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async sendBurn(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: number;
      jettonAmount: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x595f07bc, 32)
        .storeUint(opts.queryId, 64)
        .storeCoins(opts.jettonAmount)
        .storeAddress(via.address)
        .storeUint(0, 1)
        .endCell(),
    });
  }

  async getWalletJettonAmount(provider: ContractProvider): Promise<bigint> {
    const {stack} = await provider.get('get_wallet_data', []);
    return stack.readBigNumber();
  }
}



================================================
FILE: ton-exchange/wrappers/Order.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/Order.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/order.fc'],
};



================================================
FILE: ton-exchange/wrappers/Order.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/Order.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';
import {Maybe} from '@ton/ton/dist/utils/maybe';

export type OrderConfig = {
  status: number;
  baseJettonAddress?: Maybe<Address>;
  quoteJettonAddress?: Maybe<Address>;
  side: number;
  quantity: number;
  price: number;
  deployerAddress: Address;
  creatorAddress?: Maybe<Address>;
  walletAddress?: Maybe<Address>;
  orderId: number;
  orderCode: Cell;
  jettonWalletCode: Cell;
  expirationTime: number;
};

function orderConfigToCell(config: OrderConfig): Cell {
  return beginCell()
    .storeUint(config.status, 3)
    .storeRef(
      beginCell()
        .storeAddress(config.baseJettonAddress)
        .storeAddress(config.quoteJettonAddress)
        .endCell()
    )
    .storeUint(config.side, 1)
    .storeUint(config.quantity, 64)
    .storeUint(config.price, 64)
    .storeUint(config.orderId, 32)
    .storeAddress(config.deployerAddress)
    .storeAddress(config.creatorAddress)
    .storeAddress(config.walletAddress)
    .storeRef(config.orderCode)
    .storeRef(config.jettonWalletCode)
    .storeUint(config.expirationTime, 64)
    .endCell();
}

export class Order implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new Order(address);
  }

  static createFromConfig(config: OrderConfig, code: Cell, workchain = 0) {
    const data = orderConfigToCell(config);
    const init = {code, data};
    return new Order(contractAddress(workchain, init), init);
  }

  async sendDeploy(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    {
      queryId,
      creatorAddress,
    }: {
      queryId: number;
      creatorAddress: Address;
    }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x25de17e2, 32)
        .storeUint(queryId, 64)
        .storeAddress(creatorAddress)
        .endCell(),
    });
  }

  async sendRecall(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    {
      queryId,
    }: {
      queryId: number;
    } = {queryId: 0}
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x84302c25n, 32)
        .storeUint(queryId, 64)
        .endCell(),
    });
  }

  async getOrderData(provider: ContractProvider) {
    const {stack} = await provider.get('get_order_data', []);

    const status = stack.readNumber();
    const baseWalletAddress = stack.readAddressOpt();
    const quoteWalletAddress = stack.readAddressOpt();
    const side = stack.readNumber();
    const totalAmount = stack.readBigNumber();
    const price = stack.readNumber();
    const orderId = stack.readNumber();
    const deployerAddress = stack.readAddressOpt();
    const creatorAddress = stack.readAddressOpt();
    const walletAddress = stack.readAddressOpt();
    const orderCode = stack.readCell();
    const jettonWalletCode = stack.readCell();
    const expirationTime = stack.readNumber();

    return {
      status,
      baseWalletAddress,
      quoteWalletAddress,
      side,
      totalAmount,
      price,
      orderId,
      deployerAddress,
      creatorAddress,
      walletAddress,
      orderCode,
      jettonWalletCode,
      expirationTime,
    };
  }

  async getState(provider: ContractProvider) {
    return provider.getState();
  }
}



================================================
FILE: ton-exchange/wrappers/OrderDeployer.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/OrderDeployer.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/order_deployer.fc'],
};



================================================
FILE: ton-exchange/wrappers/OrderDeployer.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/OrderDeployer.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleBuilder,
} from '@ton/core';

export type OrderDeployerConfig = {
  admin: Address;
  orderId: number;
  orderCode: Cell;
  jettonWalletCode: Cell;
  tonOrderCode: Cell;
};

export function orderDeployerConfigToCell(config: OrderDeployerConfig): Cell {
  return beginCell()
    .storeAddress(config.admin)
    .storeUint(config.orderId, 32)
    .storeRef(config.orderCode)
    .storeRef(config.jettonWalletCode)
    .storeRef(config.tonOrderCode)
    .endCell();
}

export class OrderDeployer implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new OrderDeployer(address);
  }

  static createFromConfig(
    config: OrderDeployerConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = orderDeployerConfigToCell(config);
    const init = {code, data};
    return new OrderDeployer(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendCreateTonOrder(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: number;
      jettonMasterAddress: Address;
      tonAmount: bigint;
      price: number;
      expirationTime: number;
    }
  ) {

    const body = beginCell()
      .storeUint(0x26de17e2, 32)
      .storeUint(opts.queryId, 64)
      .storeAddress(opts.jettonMasterAddress)
      .storeCoins(opts.tonAmount)
      .storeUint(opts.price, 64)
      .storeUint(opts.expirationTime, 64)
    .endCell();

    // console.log(body.toString());

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async getOrderDeployerData(
    provider: ContractProvider
  ): Promise<OrderDeployerConfig> {
    const res = await provider.get('get_order_deployer_data', []);
    return {
      admin: res.stack.readAddress(),
      orderId: res.stack.readNumber(),
      orderCode: res.stack.readCell(),
      jettonWalletCode: res.stack.readCell(),
      tonOrderCode: res.stack.readCell(),
    };
  }

  async getOrderAddress(
    provider: ContractProvider,
    orderId: number,
    orderType: number
  ): Promise<{address: Address}> {
    const builder = new TupleBuilder();
    builder.writeNumber(orderId);
    builder.writeNumber(orderType);
    const res = await provider.get('get_order_address', builder.build());
    return {
      address: res.stack.readAddress(),
    };
  }
}



================================================
FILE: ton-exchange/wrappers/TonOrder.compile.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/TonOrder.compile.ts
================================================
import {CompilerConfig} from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/ton_order.fc'],
};



================================================
FILE: ton-exchange/wrappers/TonOrder.ts
URL: https://github.com/ton-community/onboarding-sandbox/blob/main/ton-exchange/wrappers/TonOrder.ts
================================================
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';
import {Maybe} from '@ton/ton/dist/utils/maybe';

export type TonOrderConfig = {
  status: number;
  side: number;
  quantity: number;
  price: number;
  orderId: number;
  deployerAddress: Address;
  jettonMasterAddress?: Maybe<Address>;
  creatorAddress?: Maybe<Address>;
  orderCode: Cell;
  jettonWalletCode: Cell;
  expirationTime: number;
};

function tonOrderConfigToCell(config: TonOrderConfig): Cell {
  const addressesCell = beginCell()
    .storeAddress(config.deployerAddress)
    .storeAddress(config.jettonMasterAddress)
    .storeAddress(config.creatorAddress)
    .endCell();

  return beginCell()
    .storeUint(config.status, 3)
    .storeUint(config.side, 1)
    .storeCoins(config.quantity)
    .storeUint(config.price, 64)
    .storeUint(config.orderId, 32)
    .storeRef(addressesCell)
    .storeRef(config.orderCode)
    .storeRef(config.jettonWalletCode)
    .storeUint(config.expirationTime, 64)
    .endCell();
}

export class TonOrder implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {code: Cell; data: Cell}
  ) {}

  static createFromAddress(address: Address) {
    return new TonOrder(address);
  }

  static createFromConfig(config: TonOrderConfig, code: Cell, workchain = 0) {
    const data = tonOrderConfigToCell(config);
    const init = {code, data};
    return new TonOrder(contractAddress(workchain, init), init);
  }

  async sendDeploy(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    opts: {
      side: number;
      queryId: number;
      quantity: number;
      price: number;
      jettonMasterAddress: Address;
      creatorAddress: Address;
      expirationTime: number;
    }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x26de17e3, 32)
        .storeUint(opts.queryId, 64)
        .storeUint(opts.side, 1)
        .storeCoins(opts.quantity)
        .storeUint(opts.price, 64)
        .storeAddress(opts.jettonMasterAddress)
        .storeAddress(opts.creatorAddress)
        .storeUint(opts.expirationTime, 64)
        .endCell(),
    });
  }

  async sendClose(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint | string;
      queryId: number;
    }
  ) {
    const body = beginCell()
      .storeUint(0x26de17e4, 32)
      .storeUint(opts.queryId, 64)
      .endCell();

    // console.log(body.toString());

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendRecall(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint | string;
      queryId: number;
    }
  ) {
    const body = beginCell()
      .storeUint(0x26de17e5n, 32)
      .storeUint(opts.queryId, 64)
      .endCell();

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }
  async getOrderData(provider: ContractProvider) {
    const {stack} = await provider.get('get_order_data', []);

    const status = stack.readNumber();
    const side = stack.readNumber();
    const quantity = stack.readNumber();
    const price = stack.readNumber();
    const orderId = stack.readNumber();
    const deployerAddress = stack.readAddressOpt();
    const creatorAddress = stack.readAddressOpt();
    const jettonMasterAddress = stack.readAddressOpt();
    const orderCode = stack.readCell();
    const jettonWalletCode = stack.readCell();
    const expirationTime = stack.readNumber();

    return {
      status,
      side,
      quantity,
      price,
      orderId,
      deployerAddress,
      jettonMasterAddress,
      creatorAddress,
      orderCode,
      jettonWalletCode,
      expirationTime,
    };
  }

  async getState(provider: ContractProvider) {
    return provider.getState();
  }
}




# Repository: tutorials
URL: https://github.com/ton-community/tutorials
Branch: main

## Directory Structure:
```
└── tutorials/
    ├── 01-wallet/
        ├── author.json
        ├── index.md
        ├── options.json
        ├── test/
            ├── npmton/
                ├── README.md
                ├── index.sh
                ├── step7.expected.txt
                ├── step7.ts
                ├── step8.expected.txt
                ├── step8.ts
                ├── step9.expected.txt
                ├── step9.ts
            ├── tonweb/
                ├── README.md
                ├── index.sh
                ├── step7.expected.txt
                ├── step7.ts
                ├── step8.expected.txt
                ├── step8.ts
                ├── step9.expected.txt
                ├── step9.ts
    ├── 02-contract/
        ├── author.json
        ├── index.md
        ├── options.json
        ├── test/
            ├── README.md
            ├── counter.fc
            ├── counter.step10.ts
            ├── counter.step7.ts
            ├── counter.step9.ts
            ├── deploy.step8.ts
            ├── getCounter.expected.txt
            ├── getCounter.ts
            ├── imports/
                ├── stdlib.fc
            ├── index.sh
            ├── sendIncrement.expected.txt
            ├── sendIncrement.ts
    ├── 03-client/
        ├── author.json
        ├── index.md
        ├── options.json
        ├── test/
            ├── README.md
            ├── index.sh
            ├── public/
                ├── tonconnect-manifest.json
            ├── src/
                ├── App.step10.tsx
                ├── App.step5.tsx
                ├── App.step6.tsx
                ├── App.step7.tsx
                ├── contracts/
                    ├── counter.ts
                ├── hooks/
                    ├── useAsyncInitialize.ts
                    ├── useCounterContract.step6.ts
                    ├── useCounterContract.step7.ts
                    ├── useTonClient.ts
                    ├── useTonConnect.ts
                ├── index.css
                ├── main.tsx
            ├── vite.config.ts
    ├── 04-testing/
        ├── author.json
        ├── index.md
        ├── options.json
        ├── test/
            ├── README.md
            ├── counter.cell
            ├── counter.debug.cell
            ├── counter.ts
            ├── index.sh
            ├── jest.config.js
            ├── step2.spec.ts
            ├── step3.spec.ts
            ├── step4.spec.ts
            ├── step5.expected.txt
            ├── step5.spec.ts
    ├── HELP.md
    ├── LICENSE
    ├── README.md
    ├── build.sh
    ├── docs/
        ├── 01-wallet/
            ├── index.html
            ├── mainnet-npmton.html
            ├── mainnet-npmton.md
            ├── mainnet-tonweb.html
            ├── mainnet-tonweb.md
            ├── options.json
            ├── testnet-npmton.html
            ├── testnet-npmton.md
            ├── testnet-tonweb.html
            ├── testnet-tonweb.md
        ├── 02-contract/
            ├── index.html
            ├── mainnet-npmton.html
            ├── mainnet-npmton.md
            ├── options.json
            ├── testnet-npmton.html
            ├── testnet-npmton.md
        ├── 03-client/
            ├── index.html
            ├── mainnet-npmton.html
            ├── mainnet-npmton.md
            ├── options.json
            ├── testnet-npmton.html
            ├── testnet-npmton.md
        ├── 04-testing/
            ├── index.html
            ├── npmton.html
            ├── npmton.md
            ├── options.json
        ├── CNAME
        ├── assets/
            ├── arrow-down.svg
            ├── authors/
                ├── shaharyakir.jpg
                ├── talkol.jpg
            ├── copy.svg
            ├── favicon.png
            ├── func.min.js
            ├── index.html
            ├── link.svg
            ├── logo.svg
            ├── styles.css
            ├── styles.css.map
            ├── twa.mp4
        ├── index.html
```

## Files Content:

================================================
FILE: 01-wallet/author.json
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/author.json
================================================
{
  "name": "Tal Kol",
  "image": "talkol.jpg",
  "telegram": "https://t.me/talkol",
  "twitter": "https://twitter.com/koltal"
}


================================================
FILE: 01-wallet/index.md
URL: https://github.com/ton-community/tutorials/blob/main/01-wallet/index.md
================================================

# TON Hello World part 1: Step by step guide for working with your first TON wallet

TON Blockchain is [based](https://ton-blockchain.github.io/docs/ton.pdf) on the [TON coin](https://coinmarketcap.com/currencies/toncoin/) (previously labeled TonCoin). This cryptocurrency is used to pay for executing transactions (gas), much like ETH on the Ethereum blockchain. If you're participating in the TON ecosystem, most likely that you're already holding some TON and probably already have a wallet.

In this step by step tutorial, we will create a new TON wallet using one of the wallet apps and then try to access it programmatically. This can be useful for example if you're planning on deploying a smart contract through code or writing a bot that receives and sends TON. We'll also understand how wallets work on TON and become comfortable with using them.

## Mainnet or testnet

There are two variations of TON Blockchain we can work on - *mainnet* and *testnet*. Mainnet is the real thing, where we would have to pay real TON coin in order to transact and staked validators would execute our transactions and guarantee a very high level of security - our wallet would be able to do dangerous things like holding large amounts of money without worrying too much.

Testnet is a testing playground where the TON coin isn't real and is available for free. Naturally, testnet doesn't offer any real security so we would just use it to practice and see that our code is behaving as expected.

Testnet is often appealing to new developers because it's free, but experience shows that mainnet is actually more cost effective. Since testnet is a simulated environment, it requires special wallets, doesn't always behave like the real thing and is more prone to flakiness and random errors.

Since TON transactions are very cheap, about 1 cent per transaction, investing just $5 will be enough for hundreds of transactions. If you decide to work on mainnet you will have a significantly smoother experience. The time you save will definitely be worth more than the $5 you spent.

## Step 1: Create a new wallet using an app

The simplest way to create a TON wallet is visit [https://ton.org/wallets](https://ton.org/wallets) and choose one of the wallet apps from the list. This page explains the difference between custodial and non-custodial wallets. With a non-custodial wallet, you own the wallet and hold its private key by yourself. With a custodial wallet, you trust somebody else to do this for you.

The point of blockchain is being in control of your own funds, so we'll naturally choose a non-custodial option. They're all pretty similar, let's choose [Tonkeeper](https://tonkeeper.com). Go ahead and install the Tonkeeper app on your phone and run it.

---
network:testnet
---
Tonkeeper works by default on TON mainnet. If you decided to work on testnet, you will need to switch the app manually to dev mode. Open the "Settings" tab and tap 5 times quickly on the Tonkeeper Logo on the bottom. The "Dev Menu" should show up. Click on "Switch to Testnet" and make the switch. You can use this menu later to return to mainnet.

---

If you don't already have a wallet connected to the app, tap on the "Set up wallet" button. We're going to create a new wallet. After a few seconds, your wallet is created and Tonkeeper displays your recovery phrase - the secret 24 words that give access to your wallet funds.

## Step 2: Backup the 24 word recovery phrase

The recovery phrase is the key to accessing your wallet. Lose this phrase and you'll lose access to your funds. Give this phrase to somebody and they'll be able to take your funds. Keep this secret and backed up in a safe place.

Why 24 words? The OG crypto wallets, like Bitcoin in its early days, did not use word phrases, they used a bunch of random looking letters to specify your key. This didn't work so well because of typos. People would make a mistake with a single letter and not be able to access their funds. The idea behind words was to eliminate these mistakes and make the key easier to write down. These phrases are also called "mnemonics" because they act as [mnemonic](https://en.wikipedia.org/wiki/Mnemonic) devices that make remembering them easier for humans.

## Step 3: View the wallet by address in an explorer

If you click on the top left in the Tonkeeper app you will copy your wallet address. Alternatively, you can tap on the "Receive" button and see your wallet address displayed on screen.

It should look something like this:

```console
kQCJRglfvsQzAIF0UAhkYH6zkdGPFxVNYMH1nPTN_UpDqEFK
```

This wallet address isn't secret. You can share it with anyone you want and they won't be able to touch your funds. If you want anyone to send you some TON, you will need to give them this address. You should be aware though of some privacy matters. Wallet addresses in TON and most blockchains are [pseudo-anonymous](https://en.wikipedia.org/wiki/Pseudonymization), this means that they don't reveal your identity in the real world. If you tell somebody your address and they know you in the real world, they can now make the connection.

An explorer is a tool that allows you to query data from the chain and investigate TON addresses. There are many [explorers](https://ton.app/explorers) to choose from. We're going to use Tonscan. Notice that mainnet and testnet have different explorers because those are different blockchains.

---
network:mainnet
---
The mainnet version of Tonscan is available on [https://tonscan.org](https://tonscan.org) - open it and input your wallet address.

---

---
network:testnet
---
The testnet version of Tonscan is available on [https://testnet.tonscan.org](https://testnet.tonscan.org) - open it and input your wallet address.

---

If this wallet is indeed new and hasn't been used before, its Tonscan page should show "State" as "Inactive". When you look under the "Contract" tab, you should see the message "This address doesn't contain any data in blockchain - it was either never used or the contract was deleted."

<img src="https://i.imgur.com/r1POqo9.png" width=600 /><br>

Wallets in TON are also smart contracts! What this message means is that this smart contract hasn't been deployed yet and is therefore uninitialized. Deploying a smart contract means uploading its code onto the blockchain.

Another interesting thing to notice is that the address shown in Tonscan may be different from the address you typed in the search bar! There are multiple ways to encode the same TON address. You can use [https://ton.org/address](https://ton.org/address) to see some additional representations and verify that they all share the same HEX public key.

## Step 4: Fund and deploy your wallet contract

As you can see in the explorer, the TON balance of our wallet is currently zero. We will need to fund our wallet by asking somebody to transfer some TON coins to our address. But wait... isn't this dangerous? How can we transfer some coins to the smart contract before it is deployed?

It turns out that this isn't a problem on TON. TON Blockchain maintains a list of accounts by address and stores the TON coin balance per address. Since our wallet smart contract has an address, it can have a balance, even before it has been deployed. Let's send 2 TON to our wallet address.

---
network:testnet
---
When using testnet, TON coins can be received for free. Using Telegram messenger, open the faucet [https://t.me/testgiver_ton_bot](https://t.me/testgiver_ton_bot) and request some coins from the bot by providing your wallet address.

---

Refresh the explorer after the coins have been sent. As you can see, the balance of the smart contract is now 2 TON. And the "State" remains "Inactive", meaning it still hasn't been deployed.

<img src="https://i.imgur.com/OdIRwvo.png" width=600 /><br>

So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer. This transaction is going to cost gas, so your balance cannot be zero to make it. Tonkeeper is going to deploy our smart contract automatically when we issue the first transfer.

Let's send 0.01 TON somewhere through Tonkeeper.

Refresh the explorer after approving the transaction. We can see that Tonkeeper indeed deployed our contract! The "State" is now "Active". The contract is no longer uninitialized and shows "wallet v4 r2" instead. Your contract may show a different version if Tonkeeper was updated since this tutorial was written.

<img src="https://i.imgur.com/P9uuKaU.png" width=600 /><br>

We can also see that we've also paid some gas for the deployment and transfer fees. After sending 0.01 TON we have 1.9764 TON remaining, meaning we paid a total of 0.0136 TON in fees, not too bad.

## Step 5: Wallets contracts have versions

The explorer shows that "Contract Type" is "wallet v4 r2" (or possibly a different version if your Tonkeeper was since updated). This refers to the version of our smart contract code. If our wallet smart contract was deployed with "v4" as its code, this means somewhere must exist "v1", "v2" and "v3".

This is indeed correct. Over time, the TON core team has [published](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md) multiple versions of the wallet contract - this is [v4 source code](https://github.com/ton-blockchain/wallet-contract/tree/v4r2-stable).

Let's look at this well known wallet address of [TON Foundation](https://tonscan.org/address/EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N). As you can see, it uses "wallet v3 r2" for its code. It was probably deployed before v4 was released.

<img src="https://i.imgur.com/xsZbZ5X.png" width=600 /><br>

Is it possible for the same secret mnemonic to have multiple wallets deployed with different versions? Definitely! This means that the same user may have multiple different wallets, each with its own unique address. This can get confusing. The next time you try to access your wallet using your secret mnemonic and you see a different address than you expect and a balance of zero, don't be alarmed. Nobody stole your money, you are probably just looking at the wrong wallet version.

## Step 6: Set up your local machine for coding

We're about to use code to access our wallet programmatically. Before we can start writing code, we need to install certain developer tools on our computer.

The libraries we're going to rely on are implemented in JavaScript. Accordingly, our scripts will be executed by an engine called Nodejs. The installation instructions are [here](https://nodejs.org/). We will need a fairly recent version of node like v16 or v17. You can verify your nodejs version by running `node -v` in terminal.

For a choice of IDE, you will need anything that has decent TypeScript support. I recommend [Visual Studio Code](https://code.visualstudio.com) - it's free and open source.

Let's create a new directory for our project and support TypeScript. Open terminal in the project directory and run the following:

```console
npm install typescript ts-node
```

Next, we're going to initialize Typescript project:

```console
npx tsc --init
```

---
library:npmton
---
Next, we're going to install a JavaScript package named [@ton/ton](https://www.npmjs.com/package/@ton/ton) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install @ton/ton @ton/crypto @ton/core
```

---

---
library:tonweb
---
Next, we're going to install a JavaScript package named [TonWeb](https://github.com/toncenter/tonweb) that will allow us to make TON API calls and manipulate TON objects. Install the package by opening terminal in the project directory and running:

```console
npm install tonweb tonweb-mnemonic
```

---

## Step 7: Get the wallet address programmatically

The first thing we'll do is calculate the address of our wallet in code and see that it matches what we saw in the explorer. This action is completely offline since the wallet address is derived from the version of the wallet and the private key used to create it.

Let's assume that your secret 24 word mnemonic is `unfold sugar water ...` - this is the phrase we backed up in step 2.

Create the file `step7.ts` with the following content:

---
network:testnet library:npmton
---
```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

---

---
network:mainnet library:npmton
---
```ts
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // print wallet address
  console.log(wallet.address.toString());

  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);
}

main();
```

---

---
network:testnet library:tonweb
---
```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true, true)); // last true required for testnet

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

---

---
network:mainnet library:tonweb
---
```ts
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // open wallet v4 (notice the correct wallet version here)
  const tonweb = new TonWeb();
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(undefined!, { publicKey: key.publicKey });

  // print wallet address
  const walletAddress = await wallet.getAddress();
  console.log(walletAddress.toString(true, true, true));

  // print wallet workchain
  console.log("workchain:", walletAddress.wc);
}

main();
```

---

To see the wallet address, run it using terminal:

```console
npx ts-node step7.ts
```

Notice that we're not just printing the address, we're also printing the workchain number. TON supports multiple parallel blockchain instances called *workchains*. Today, only two workchains exist, workchain 0 is used for all of our regular contracts, and workchain -1 (the masterchain) is used by the validators. Unless you're doing something special, you'll always use workchain 0.

---
library:npmton
---
As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `WalletContractV4` with `WalletContractV3R2`.
---

---
library:tonweb
---
As discussed in step 5, if your wallet has a different version from "wallet v4 r2" you will need to modify slightly the code above. Let's say for example that your version is "wallet v3 r2", then replace `tonweb.wallet.all["v4R2"]` with `tonweb.wallet.all["v3R2"]`.
---

## Step 8: Read wallet state from the chain

Let's take things up a notch and read some live state data from our wallet contract that will force us to connect to the live blockchain network. We're going to read the live wallet TON coin balance (we saw that on the explorer earlier). We're also going to read the wallet `seqno` - the sequence number of the last transaction that the wallet sent. Every time the wallet sends a transaction the seqno increments.

To query info from the live network will require an RPC service provider - similar to [Infura](https://infura.io) on Ethereum. These providers run TON Blockchain nodes and allow us to communicate with them over HTTP. [TON Access](https://orbs.com/ton-access) is an awesome service that will provide us with unthrottled API access for free. It's also decentralized, which is the preferred way to access the network.

Install it by opening terminal in the project directory and running:

```console
npm install @orbs-network/ton-access
```

Create the file `step8.ts` with the following content:

---
network:testnet library:npmton
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

---

---
network:mainnet library:npmton
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
```

---

---
network:testnet library:tonweb
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

---

---
network:mainnet library:tonweb
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import TonWeb from "tonweb";

async function main() {
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToKeyPair(mnemonic.split(" "));

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // open wallet v4 (notice the correct wallet version here)
  const WalletClass = tonweb.wallet.all["v4R2"];
  const wallet = new WalletClass(tonweb.provider, { publicKey: key.publicKey });
  const walletAddress = await wallet.getAddress();

  // query balance from chain
  const balance = await tonweb.getBalance(walletAddress);
  console.log("balance:", TonWeb.utils.fromNano(balance));

  // query seqno from chain
  const seqno = await wallet.methods.seqno().call();
  console.log("seqno:", seqno);
}

main();
```

---

To see the balance and seqno, run using terminal:

```console
npx ts-node step8.ts
```

If you have network connectivity issues and get errors like backend nodes unhealthy or timeouts, please join the [Telegram support chat](https://t.me/TONAccessSupport) for TON access to get assistance.

## Step 9: Send transfer transaction to the chain

The previous action was read-only and should generally be possible even if you don't have the private key of the wallet. Now, we're going to transfer some TON from the wallet. Since this is a privileged write action, the private key is required.

<strong>Reward:</strong> We will send 0.05 TON to the special address to mint a secret NFT from <a target="_blank" href="https://getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">"TON Masters"</a> collection  (<a target="_blank" href="https://testnet.getgems.io/collection/EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST">testnet link</a>). Here is how your reward looks like:

<video style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" autoplay loop muted playsinline>
  <source src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tal-tutorials/1-wallet/video.mp4" type="video/mp4">
</video>

Create a new file `step9.ts` with this content:

---
network:testnet library:npmton
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

---
network:mainnet library:npmton
---
```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on mainnet
  const endpoint = await getHttpEndpoint();
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed