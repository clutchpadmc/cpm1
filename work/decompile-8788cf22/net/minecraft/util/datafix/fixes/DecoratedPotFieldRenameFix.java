package net.minecraft.util.datafix.fixes;

import com.mojang.datafixers.DataFix;
import com.mojang.datafixers.TypeRewriteRule;
import com.mojang.datafixers.schemas.Schema;
import com.mojang.datafixers.types.Type;

public class DecoratedPotFieldRenameFix extends DataFix {

    private static final String DECORATED_POT_ID = "minecraft:decorated_pot";

    public DecoratedPotFieldRenameFix(Schema schema) {
        super(schema, true);
    }

    protected TypeRewriteRule makeRule() {
        Type<?> type = this.getInputSchema().getChoiceType(DataConverterTypes.BLOCK_ENTITY, "minecraft:decorated_pot");
        Type<?> type1 = this.getOutputSchema().getChoiceType(DataConverterTypes.BLOCK_ENTITY, "minecraft:decorated_pot");

        return this.convertUnchecked("DecoratedPotFieldRenameFix", type, type1);
    }
}
