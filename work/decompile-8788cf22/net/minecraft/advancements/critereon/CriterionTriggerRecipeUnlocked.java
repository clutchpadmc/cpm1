package net.minecraft.advancements.critereon;

import com.google.gson.JsonObject;
import net.minecraft.resources.MinecraftKey;
import net.minecraft.server.level.EntityPlayer;
import net.minecraft.util.ChatDeserializer;
import net.minecraft.world.item.crafting.IRecipe;

public class CriterionTriggerRecipeUnlocked extends CriterionTriggerAbstract<CriterionTriggerRecipeUnlocked.a> {

    static final MinecraftKey ID = new MinecraftKey("recipe_unlocked");

    public CriterionTriggerRecipeUnlocked() {}

    @Override
    public MinecraftKey getId() {
        return CriterionTriggerRecipeUnlocked.ID;
    }

    @Override
    public CriterionTriggerRecipeUnlocked.a createInstance(JsonObject jsonobject, ContextAwarePredicate contextawarepredicate, LootDeserializationContext lootdeserializationcontext) {
        MinecraftKey minecraftkey = new MinecraftKey(ChatDeserializer.getAsString(jsonobject, "recipe"));

        return new CriterionTriggerRecipeUnlocked.a(contextawarepredicate, minecraftkey);
    }

    public void trigger(EntityPlayer entityplayer, IRecipe<?> irecipe) {
        this.trigger(entityplayer, (criteriontriggerrecipeunlocked_a) -> {
            return criteriontriggerrecipeunlocked_a.matches(irecipe);
        });
    }

    public static CriterionTriggerRecipeUnlocked.a unlocked(MinecraftKey minecraftkey) {
        return new CriterionTriggerRecipeUnlocked.a(ContextAwarePredicate.ANY, minecraftkey);
    }

    public static class a extends CriterionInstanceAbstract {

        private final MinecraftKey recipe;

        public a(ContextAwarePredicate contextawarepredicate, MinecraftKey minecraftkey) {
            super(CriterionTriggerRecipeUnlocked.ID, contextawarepredicate);
            this.recipe = minecraftkey;
        }

        @Override
        public JsonObject serializeToJson(LootSerializationContext lootserializationcontext) {
            JsonObject jsonobject = super.serializeToJson(lootserializationcontext);

            jsonobject.addProperty("recipe", this.recipe.toString());
            return jsonobject;
        }

        public boolean matches(IRecipe<?> irecipe) {
            return this.recipe.equals(irecipe.getId());
        }
    }
}
