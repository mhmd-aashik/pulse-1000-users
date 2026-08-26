CREATE INDEX "follows_follower_id_idx" ON "follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "follows_following_id_idx" ON "follows" USING btree ("following_id");--> statement-breakpoint
CREATE INDEX "post_user_created_at_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "posts_user_created_at_idx" ON "posts" USING btree ("user_id","created_at");