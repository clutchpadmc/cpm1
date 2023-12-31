package net.minecraft.advancements.critereon;

import com.google.gson.JsonObject;
import net.minecraft.resources.MinecraftKey;
import net.minecraft.server.level.EntityPlayer;
import net.minecraft.util.ChatDeserializer;

public class CriterionTriggerPlayerGeneratesContainerLoot extends CriterionTriggerAbstract<CriterionTriggerPlayerGeneratesContainerLoot.a> {

    static final MinecraftKey ID = new MinecraftKey("player_generates_container_loot");

    public CriterionTriggerPlayerGeneratesContainerLoot() {}

    @Override
    public MinecraftKey getId() {
        return CriterionTriggerPlayerGeneratesContainerLoot.ID;
    }

    @Override
    protected CriterionTriggerPlayerGeneratesContainerLoot.a createInstance(JsonObject jsonobject, ContextAwarePredicate contextawarepredicate, LootDeserializationContext lootdeserializationcontext) {
        MinecraftKey minecraftkey = new MinecraftKey(ChatDeserializer.getAsString(jsonobject, "loot_table"));

        return new CriterionTriggerPlayerGeneratesContainerLoot.a(contextawarepredicate, minecraftkey);
    }

    public void trigger(EntityPlayer entityplayer, MinecraftKey minecraftkey) {
        this.trigger(entityplayer, (criteriontriggerplayergeneratescontainerloot_a) -> {
            return criteriontriggerplayergeneratescontainerloot_a.matches(minecraftkey);
        });
    }

    public static class a extends CriterionInstanceAbstract {

        private final MinecraftKey lootTable;

        public a(ContextAwarePredicate contextawarepredicate, MinecraftKey minecraftkey) {
            super(CriterionTriggerPlayerGeneratesContainerLoot.ID, contextawarepredicate);
            this.lootTable = minecraftkey;
        }

        public static CriterionTriggerPlayerGeneratesContainerLoot.a lootTableUsed(MinecraftKey minecraftkey) {
            return new CriterionTriggerPlayerGeneratesContainerLoot.a(ContextAwarePredicate.ANY, minecraftkey);
        }

        public boolean matches(MinecraftKey minecraftkey) {
            return this.lootTable.equals(minecraftkey);
        }

        @Override
        public JsonObject serializeToJson(LootSerializationContext lootserializationcontext) {
            JsonObject jsonobject = super.serializeToJson(lootserializationcontext);

            jsonobject.addProperty("loot_table", this.lootTable.toString());
            return jsonobject;
        }
    }
}
