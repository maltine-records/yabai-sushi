# -*- coding: utf-8 -*-
require 'rubygems'
require 'rack'
require 'sinatra'
require 'redis'
require 'json'

configure do
  set :public_folder, 'public'
  disable :protection

  filepath = '/home/dotcloud/environment.json'
  env = JSON.parse(File.open(filepath).read)
  host = env['DOTCLOUD_DATA_REDIS_HOST']
  port = env['DOTCLOUD_DATA_REDIS_PORT']
  pass = env['DOTCLOUD_DATA_REDIS_PASSWORD']
  redis = Redis.new(:host => host, :port => port, :password => pass)
  set :redis, redis
end

get '/' do
  redis = settings.redis
  hour_str = Time.now.strftime("%Y%m%d_%H")
  redis.setnx(hour_str, 0)
  redis.incr(hour_str)
  hour_count = redis.get(hour_str)

  min_str  = Time.now.strftime("%Y%m%d_%H%M")
  redis.setnx(min_str, 0)
  redis.incr(min_str)
  min_count = redis.get(min_str)

  "sushi / hour : #{hour_count}, min : #{min_count}"
end

