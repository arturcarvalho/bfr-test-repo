use std::collections::HashMap;
use std::io;

struct Config {
    host: String,
    port: u16,
    debug: bool,
}

impl Config {
    fn new() -> Self {
        Config {
            host: String::from("127.0.0.1"),
            port: 8080,
            debug: false,
        }
    }

    fn address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}

fn parse_query(query: &str) -> HashMap<&str, &str> {
    let mut params = HashMap::new();
    for pair in query.split('&') {
        if let Some((key, value)) = pair.split_once('=') {
            params.insert(key, value);
        }
    }
    params
}

fn main() -> io::Result<()> {
    let config = Config::new();
    println!("Starting server at {}", config.address());
    Ok(())
}
