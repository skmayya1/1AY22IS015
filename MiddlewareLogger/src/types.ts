export interface Logger {
  stack: "backend" | "frontend";
  level: "debug" | "info" | "warn" | "error" | "fatal";
  package:
    | "cache"
    | "controller"
    | "cron_job"
    | "db"
    | "domain"
    | "handler"
    | "repository"
    | "route"
    | "service"
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style"
    | "auth"
    | "config"
    | "middleware"
    | "utils";
  message: string;
}